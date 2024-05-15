<?php
class Comment_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    // Query comments for an answer
    public function get_comments_for_answer($answer_id) {
        $this->db->select('Comment.*, User.username as commenter_username');
        $this->db->from('Comment');
        $this->db->join('User', 'User.user_id = Comment.user_id');
        $this->db->where('answer_id', $answer_id);
        $query = $this->db->get();

        return $query->result_array();
    }
}
?>
