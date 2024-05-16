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

    // Fetches a user by username, email, and registered date
    public function get_user_by_reset_info($username, $email, $joined_date) {
        $this->db->where('username', $username);
        $this->db->where('email', $email);
        $this->db->where('DATE(registered_date)', date('Y-m-d', strtotime($joined_date))); // Assuming the date format is yyyy-mm-dd
        $query = $this->db->get('User');
        return $query->row();
    }

    // Updates a user's password
    public function update_user_password($user_id, $new_password) {
        $this->db->set('password', $new_password);
        $this->db->where('user_id', $user_id);
        return $this->db->update('User');
    }

    // Updates user details
    public function update_user($user_id, $data) {
        $this->db->where('user_id', $user_id);
        return $this->db->update('User', $data);
    }
}
?>