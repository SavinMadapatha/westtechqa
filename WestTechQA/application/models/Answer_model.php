<?php
class Answer_model extends CI_Model {

public function __construct() {
    parent::__construct();
    $this->load->database();
}

// Add new answer
public function set_answer($data) {
    $insert = $this->db->insert('Answer', $data);
    return $this->db->insert_id(); 

}
}
?>