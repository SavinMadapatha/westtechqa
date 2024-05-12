<?php
class Question_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    // Get all questions
    public function get_questions() {
        $this->db->select('Question.*, User.username, COUNT(DISTINCT Answer.answer_id) as answersCount, GROUP_CONCAT(DISTINCT Tag.tag_name ORDER BY Tag.tag_name) as tags');
        $this->db->from('Question');
        $this->db->join('User', 'User.user_id = Question.user_id');
        $this->db->join('Answer', 'Answer.question_id = Question.question_id', 'left');
        $this->db->join('QuestionTag', 'QuestionTag.question_id = Question.question_id', 'left');
        $this->db->join('Tag', 'Tag.tag_id = QuestionTag.tag_id', 'left');
        $this->db->group_by('Question.question_id'); // Group by question to count answers and concatenate tags correctly
        $this->db->order_by('Question.posted_date', 'DESC');
    
        $query = $this->db->get();
        // Process each row to add tags as an array
        $results = $query->result_array();
        foreach ($results as $key => $row) {
            $results[$key]['tags'] = explode(',', $row['tags']);
        }
        return $results;
    }

    // Get a single question by ID
    // Retrieve a question with its answers, user info, and tags
    public function get_question_with_details($id) {
        // First, get the question details along with user info
        $this->db->select('Question.*, User.username');
        $this->db->from('Question');
        $this->db->join('User', 'User.user_id = Question.user_id');
        $this->db->where('question_id', $id);
        $question = $this->db->get()->row_array();

        // Check if the question exists
        if (!$question) return null;

        // Get the answers and user info for each answer
        $this->db->select('Answer.*, User.username');
        $this->db->from('Answer');
        $this->db->join('User', 'User.user_id = Answer.user_id');
        $this->db->where('question_id', $id);
        $answers = $this->db->get()->result_array();

        // Now get the tags for the question
        $this->db->select('Tag.tag_name');
        $this->db->from('QuestionTag');
        $this->db->join('Tag', 'Tag.tag_id = QuestionTag.tag_id');
        $this->db->where('question_id', $id);
        $tags = $this->db->get()->result_array();

        // Add the answers and tags to the question array
        $question['answers'] = $answers;
        $question['tags'] = array_column($tags, 'tag_name'); // Flatten the tags array

        return $question;
    }

    // Add a new question
    public function set_question($data) {
        $this->db->insert('Question', $data);
        return $this->db->insert_id(); 
    }

    // Update an existing question
    public function update_question($id, $data) {
        $this->db->where('question_id', $id);
        return $this->db->update('Question', $data);
    }

    // Delete a question
    public function delete_question($id) {
        $this->db->where('question_id', $id);
        return $this->db->delete('Question');
    }
}
