<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AuthController extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('UserModel');
        $this->load->helper('url');
        $this->load->library('session');
    }

    // Shows the login page
    public function index() {
        $this->load->view('LoginView');
    }

    // Register a new user
    public function register($email, $username, $password) {
        $timestamp = date('Y-m-d H:i:s');
        $this->UserModel->createUser($email, $username, $password, $timestamp);
        // Redirect or load a view after registration
    }

    // Process login
    public function login($username, $password) {
        $userInfo = $this->UserModel->getUserInfo($username);
        if ($userInfo && password_verify($password, $userInfo['password'])) {
            // Set session data or token
            $this->session->set_userdata('logged_in', true);
            // Redirect to the authenticated area
        } else {
            // Handle login failure
        }
    }

    // Process logout
    public function logout() {
        $this->session->unset_userdata('logged_in');
        // Redirect to login page or home page
    }
}
