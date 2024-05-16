<?php
defined('BASEPATH') OR exit('No direct script access allowed'); 

require APPPATH .'/libraries/REST_Controller.php'; 
require APPPATH .'/libraries/Format.php'; 

class AuthController extends REST_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('User_model');
        $this->load->library('form_validation');

        $this->output->set_content_type('application/json');
    }

    // this function validates the inputs given by the user and calls the insert_user() function in User_model to insert
    // the new user details to 'User' table in the DB.
    public function register_post() {
        $json = file_get_contents('php://input');
        $data = json_decode($json);
    
        // Validate the input data
        $this->form_validation->set_data((array)$data);
        $this->form_validation->set_rules('username', 'Username', 'required|alpha_numeric|min_length[5]|is_unique[User.username]');
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email|is_unique[User.email]');
        $this->form_validation->set_rules('password', 'Password', 'required|min_length[6]');
    
        if ($this->form_validation->run() === FALSE) {
            $this->output->set_status_header(400);
            $this->response([
                'success' => false, 
                'message' => validation_errors()
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }
    
        // Hash password for better security
        $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
    
        $userData = [
            'username' => $data->username,
            'email' => $data->email,
            'password' => $hashedPassword,
            'registered_date' => date('Y-m-d H:i:s')  
        ];
    
        // Insert user into the database
        if ($this->User_model->insert_user($userData)) {
            $this->response([
                'success' => true, 
                'message' => 'Registration successful'
            ], REST_Controller::HTTP_OK);
        } else {
            $this->output->set_status_header(500);
            $this->response([
                'success' => false, 
                'message' => 'Failed to register user'
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }    

    // this function verifies the login user credentials and returns the status of the login attempt.
    public function login_post() {
        $json = file_get_contents('php://input');
        $data = json_decode($json);

        // Validate the input data
        $this->form_validation->set_data((array)$data);
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('password', 'Password', 'required');

        if ($this->form_validation->run() == FALSE) {
            $this->output->set_status_header(400); 
            $this->response([
                'status' => 'error', 
                'message' => validation_errors()
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $email = $data->email;
        $password = $data->password;

        $user = $this->User_model->get_user_by_email($email);

        if ($user && password_verify($password, $user['password'])) {
            // Set user session 
            $this->session->set_userdata('logged_in', $user['user_id']);
            
            $this->response([
                'status' => 'success', 
                'message' => 'Login successful', 
                'user' => $user
            ], REST_Controller::HTTP_OK);
        } else {
            $this->output->set_status_header(401); 
            $this->response([
                'status' => 'error', 
                'message' => 'Login failed'
            ], REST_Controller::HTTP_UNAUTHORIZED);
        }
    }

    public function checkSession_get() {
        log_message('debug', 'Session Data: ' . print_r($this->session->userdata(), true));
    
        $response = [
            'logged_in' => false,  
            'status' => 'error',  
            'message' => 'User not logged-in or session has expired' 
        ];
        $http_status = REST_Controller::HTTP_UNAUTHORIZED; 
    
        if ($this->session->userdata('logged_in')) {
            $user_id = $this->session->userdata('logged_in');
            $user = $this->User_model->get_user_by_id($user_id);
            if ($user) {
                $response = [
                    'status' => 'success',
                    'logged_in' => true,
                    'user_id' => $user_id,
                    'username' => $user['username']
                ];
                $http_status = REST_Controller::HTTP_OK; 
            } else {
                $response['message'] = 'User not found'; 
            }
        }
        $this->response($response);
    }
    

    public function logout_post() {
        $this->session->sess_destroy();
        $this->response([
            'status' => 'success', 
            'message' => 'Logged out successfully'
        ], REST_Controller::HTTP_OK);
    }

    // this function handles the password reset functionality
    public function resetPassword_post() {
        $json = file_get_contents('php://input');
        $data = json_decode($json);
    
        $this->form_validation->set_data((array)$data);
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('username', 'Username', 'required');
        $this->form_validation->set_rules('joined_date', 'Joined Date', 'required');
        $this->form_validation->set_rules('new_password', 'New Password', 'required|min_length[6]');
    
        if ($this->form_validation->run() === FALSE) {
            $this->response([
                'success' => false, 
                'message' => validation_errors()
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }
    
        $user = $this->User_model->get_user_by_reset_info($data->username, $data->email, $data->joined_date);
        if (!$user) {
            $this->response([
                'success' => false, 
                'message' => 'No matching user found.'
            ], REST_Controller::HTTP_NOT_FOUND);
            return;
        }
    
        $hashedPassword = password_hash($data->new_password, PASSWORD_DEFAULT);
        if ($this->User_model->update_user_password($user->user_id, $hashedPassword)) {
            $this->response([
                'success' => true, 
                'message' => 'Password reset successfully.'
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'success' => false, 
                'message' => 'Failed to reset password.'
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function userProfile_get() {
        if (!$this->session->userdata('logged_in')) {
            $this->response([
                'success' => false, 
                'message' => 'Unauthorized access'
            ], REST_Controller::HTTP_UNAUTHORIZED);
            return;
        }
    
        $user_id = $this->session->userdata('logged_in');
        $user = $this->User_model->get_user_by_id($user_id);
    
        if ($user) {
            unset($user['password']); 
            $this->response($user, REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'success' => false, 
                'message' => 'User not found'
            ], REST_Controller::HTTP_NOT_FOUND);
        }
    }    

    public function updateUser_put() {
        if (!$this->session->userdata('logged_in')) {
            $this->response([
                'success' => false, 
                'message' => 'Unauthorized access'
            ], REST_Controller::HTTP_UNAUTHORIZED);
            return;
        }
    
        $user_id = $this->session->userdata('logged_in');
        $data = json_decode(file_get_contents('php://input'), true);
    
        if ($this->User_model->update_user($user_id, $data)) {
            $this->response([
                'success' => true,
                'message' => 'User updated successfully'
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'success' => false,
                'message' => 'Failed to update user'
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }       
    
}
?>
