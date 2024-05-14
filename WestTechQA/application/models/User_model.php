<?php
class User_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    // inserts a newly registered user data to the 'User' table in DB
    public function insert_user($data) {
        return $this->db->insert('User', $data);
    }

    public function get_user_by_email($email) {
        $this->db->where('email', $email);
        $query = $this->db->get('user');
        return $query->row_array(); 
    }

    public function get_user_by_id($user_id) {
        $this->db->where('user_id', $user_id);
        $query = $this->db->get('User');
        return $query->row_array(); 
    }

    public function verify_password($input_password, $stored_hash) {
        return password_verify($input_password, $stored_hash);
    }
}
?>