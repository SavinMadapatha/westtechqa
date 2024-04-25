<?php
class UserModel extends CI_Model {

    public function __construct() {
        parent::__construct();
        // Load database library
        $this->load->database();
    }

    // Creates a new user in the database
    public function createUser($email, $username, $password, $timestamp) {
        $data = array(
            'email' => $email,
            'username' => $username,
            'password' => password_hash($password, PASSWORD_DEFAULT), // Hash the password
            'registered_date' => $timestamp
        );
        return $this->db->insert('user', $data);
    }

    // Retrieves user information by username
    public function getUserInfo($username) {
        $this->db->where('username', $username);
        $query = $this->db->get('user');
        return $query->row_array(); // Returns a single result row
    }
}
?>