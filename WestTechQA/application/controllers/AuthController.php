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
            $this->response(['success' => false, 'message' => validation_errors()], REST_Controller::HTTP_BAD_REQUEST);
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
            $this->response(['success' => true, 'message' => 'Registration successful'], REST_Controller::HTTP_OK);
        } else {
            $this->output->set_status_header(500);
            $this->response(['success' => false, 'message' => 'Failed to register user'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
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
            $this->response(['status' => 'error', 'message' => validation_errors()], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $email = $data->email;
        $password = $data->password;

        $user = $this->User_model->get_user_by_email($email);

        if ($user && password_verify($password, $user['password'])) {
            // Set user session 
            $this->session->set_userdata('logged_in', $user['user_id']);
            
            $this->response(['status' => 'success', 'message' => 'Login successful', 'user' => $user], REST_Controller::HTTP_OK);
        } else {
            $this->output->set_status_header(401); 
            $this->response(['status' => 'error', 'message' => 'Login failed'], REST_Controller::HTTP_UNAUTHORIZED);
        }
    }

    public function checkSession_get() {
        log_message('debug', 'Session Data: ' . print_r($this->session->userdata(), true));
        if ($this->session->userdata('logged_in')) {
            $user_id = $this->session->userdata('logged_in');
            $user = $this->User_model->get_user_by_id($user_id); 
            $this->response([
                'status' => 'success', 
                'logged_in' => true, 
                'user_id' => $user_id,
                'username' => $user['username'] 
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response(['status' => 'error', 'logged_in' => false], REST_Controller::HTTP_UNAUTHORIZED);
        }
    }

    public function logout_post() {
        $this->session->sess_destroy();
        $this->response(['status' => 'success', 'message' => 'Logged out successfully'], REST_Controller::HTTP_OK);
    }
}
?>
