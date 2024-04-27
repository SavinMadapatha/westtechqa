<?php
class AuthController extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('User_model');
        $this->load->library('form_validation');
        
        // Set the response content type to JSON
        $this->output->set_content_type('application/json');
    }

    // this function validates the inputs given by the user and calls the insert_user() function in User_model to insert
    // the new user details to 'User' table in the DB.
    public function register() {
        $json = file_get_contents('php://input');
        $data = json_decode($json);

        // Input validation
        $this->form_validation->set_data((array)$data);
        $this->form_validation->set_rules('username', 'Username', 'required|alpha_numeric|min_length[5]|is_unique[User.username]');
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email|is_unique[User.email]');
        $this->form_validation->set_rules('password', 'Password', 'required|min_length[8]');

        if ($this->form_validation->run() === FALSE) {
            $this->output->set_status_header(400);
            echo json_encode(['status' => 'error', 'message' => validation_errors()]);
            return;
        }

        // Hash password
        $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);

        // Prepare user data
        $userData = [
            'username' => $data->username,
            'email' => $data->email,
            'password' => $hashedPassword,
            'registered_date' => date('Y-m-d H:i:s')  // Current date and time
        ];

        // Insert user into the database
        if ($this->User_model->insert_user($userData)) {
            echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
        } else {
            $this->output->set_status_header(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to register user']);
        }
    }

    // this function verifies the login user credentials and returns the status of the login attempt.
    public function login() {
        // Get the JSON input and decode it
        $json = file_get_contents('php://input');
        $data = json_decode($json);

        // Input validation
        $this->form_validation->set_data((array)$data);
        $this->form_validation->set_rules('email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('password', 'Password', 'required');

        if ($this->form_validation->run() == FALSE) {
            // Send back the validation errors
            $this->output->set_status_header(400); // HTTP status 400: Bad request
            echo json_encode(['status' => 'error', 'message' => validation_errors()]);
            return;
        }

        $email = $data->email;
        $password = $data->password;

        // Retrieve user from the database
        $user = $this->User_model->get_user_by_email($email);

        if ($user && password_verify($password, $user['password'])) {
            // Set user session or generate a token
            $this->session->set_userdata('logged_in', $user['user_id']);
            
            // Return success response
            echo json_encode(['status' => 'success', 'message' => 'Login successful', 'user' => $user]);
        } else {
            // Return error response
            $this->output->set_status_header(401); 
            echo json_encode(['status' => 'error', 'message' => 'Login failed']);
        }
    }

    public function check_session() {
        log_message('debug', 'Session Data: ' . print_r($this->session->userdata(), true));
        if ($this->session->userdata('logged_in')) {
            echo json_encode(['status' => 'success', 'logged_in' => true]);
        } else {
            echo json_encode(['status' => 'error', 'logged_in' => false]);
        }
    }
}
?>
