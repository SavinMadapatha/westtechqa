<?php
class Answer_model extends CI_Model {

    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->model('comment_model');
    }

    public function get_answer_with_details($answer_id) {
        $this->db->select('Answer.*, User.username as answer_username, 
                           (SELECT COUNT(*) FROM Comment WHERE Comment.answer_id = Answer.answer_id) as comments_count');
        $this->db->from('Answer');
        $this->db->join('User', 'User.user_id = Answer.user_id');
        $this->db->where('Answer.answer_id', $answer_id);
        $answer = $this->db->get()->row_array();
    
        if (!$answer) return null;
        
        $comments = $this->comment_model->get_comments_for_answer($answer_id);
        $answer['comments'] = $comments;
    
        return $answer;
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

    // Accept an answer
    public function accept_answer($answer_id, $user_id) {
        $this->db->where('answer_id', $answer_id);
        return $this->db->update('Answer', ['accepted' => 1]);
    }

    public function get_question_id_by_answer($answer_id) {
        $this->db->select('question_id');
        $this->db->from('Answer');
        $this->db->where('answer_id', $answer_id);
        $query = $this->db->get();
        
        if ($query->num_rows() > 0) {
            return $query->row()->question_id; 
        }
        
        return null;
    }

    // Check if the user is the creator of the question linked to the answer
    public function is_creator($user_id, $answer_id) {
        $this->db->select('Question.user_id');
        $this->db->from('Question');
        $this->db->join('Answer', 'Answer.question_id = Question.question_id');
        $this->db->where('Answer.answer_id', $answer_id);
        $query = $this->db->get()->row();
        return ($query && $query->user_id == $user_id);
    }
}
?>
