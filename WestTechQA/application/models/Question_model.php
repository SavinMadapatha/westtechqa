<?php
class Question_model extends CI_Model {

    public function __construct() {
        $this->load->database();
    }

    // Get all questions: If a search query is passed groups and returns the questions that has either title or content alike the query
    public function get_questions($search = null, $tag = null) {
        $this->db->select('Question.*, User.username, COUNT(DISTINCT Answer.answer_id) as answersCount, GROUP_CONCAT(DISTINCT Tag.tag_name ORDER BY Tag.tag_name) as tags');
        $this->db->from('Question');
        $this->db->join('User', 'User.user_id = Question.user_id');
        $this->db->join('Answer', 'Answer.question_id = Question.question_id', 'left');
        $this->db->join('QuestionTag', 'QuestionTag.question_id = Question.question_id', 'left');
        $this->db->join('Tag', 'Tag.tag_id = QuestionTag.tag_id', 'left');
        
        // Search by query
        if ($search) {
            $this->db->group_start();
            $this->db->like('Question.title', $search);
            $this->db->or_like('Question.content', $search);
            $this->db->group_end();
        }
    
        // Filter by tag
        if ($tag) {
            $this->db->where('Tag.tag_name', $tag);
        }
    
        $this->db->group_by('Question.question_id');
        $this->db->order_by('Question.posted_date', 'DESC');
        
        $query = $this->db->get();
        $results = $query->result_array();
    
        // Process tags for each question
        foreach ($results as $key => $row) {
            $results[$key]['tags'] = explode(',', $row['tags']);
        }
        return $results;
    }
    

    // Get a single question by ID
    public function get_question_with_details($id) {
        $this->db->select('Question.*, User.username, User.user_id as question_user_id');
        $this->db->from('Question');
        $this->db->join('User', 'User.user_id = Question.user_id');
        $this->db->where('question_id', $id);
        $question = $this->db->get()->row_array();
    
        if (!$question) return null;
    
        // Get the answers and user info for each answer
        $this->db->select('Answer.*, User.username, Answer.accepted');
        $this->db->from('Answer');
        $this->db->join('User', 'User.user_id = Answer.user_id');
        $this->db->where('question_id', $id);
        $answers = $this->db->get()->result_array();

        // Checking if an answer has been accepted for the question
        $isAnyAnswerAccepted = false;
        foreach ($answers as $answer) {
            if ($answer['accepted']) {
                $isAnyAnswerAccepted = true;
                break;
            }
        }
    
        // Get the tags for the question
        $this->db->select('Tag.tag_name');
        $this->db->from('QuestionTag');
        $this->db->join('Tag', 'Tag.tag_id = QuestionTag.tag_id');
        $this->db->where('question_id', $id);
        $tags = $this->db->get()->result_array();
    
        // Add the answers and tags to the question array
        $question['answers'] = $answers;
        $question['tags'] = array_column($tags, 'tag_name');
        $question['isCreator'] = ($this->session->userdata('logged_in') == $question['question_user_id']);  
        $question['isAnyAnswerAccepted'] = $isAnyAnswerAccepted;  

    
        return $question;
    }    

    // Add new question
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
