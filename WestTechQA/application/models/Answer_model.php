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

    // Increment vote count
    public function increment_vote($answer_id, $user_id) {
        if ($this->has_voted($answer_id, $user_id)) return false;
        
        $this->db->trans_start();
        $this->db->set('votes', 'votes+1', FALSE);
        $this->db->where('answer_id', $answer_id);
        $this->db->update('Answer');

        $this->record_vote($answer_id, $user_id, 1);
        $this->db->trans_complete();

        return $this->db->trans_status();
    }

    // Decrement vote count
    public function decrement_vote($answer_id, $user_id) {
        if ($this->has_voted($answer_id, $user_id)) return false;

        $current_votes = $this->get_current_votes($answer_id);
        if ($current_votes <= 0) return false;

        $this->db->trans_start();
        $this->db->set('votes', 'votes-1', FALSE);
        $this->db->where('answer_id', $answer_id);
        $this->db->update('Answer');

        $this->record_vote($answer_id, $user_id, -1);
        $this->db->trans_complete();

        return $this->db->trans_status();
    }

    // Check if user has already voted
    private function has_voted($answer_id, $user_id) {
        $this->db->from('VoteControl');
        $this->db->where('user_id', $user_id);
        $this->db->where('answer_id', $answer_id);
        return $this->db->count_all_results() > 0;
    }

    // Recording vote
    private function record_vote($answer_id, $user_id, $vote_type) {
        $data = [
            'user_id' => $user_id,
            'answer_id' => $answer_id,
            'vote_type' => $vote_type
        ];
        $this->db->insert('VoteControl', $data);
    }

    // Get current votes count
    private function get_current_votes($answer_id) {
        $this->db->select('votes');
        $this->db->from('Answer');
        $this->db->where('answer_id', $answer_id);
        $result = $this->db->get()->row();
        return $result ? $result->votes : 0;
    }
}
?>