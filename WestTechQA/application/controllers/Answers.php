<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class Answers extends REST_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('answer_model'); 
        $this->load->model('question_model');
    }

    // this function fetches questions based on the id: if null fetches all the questions
    // othwerwise fetches the specific question with details
    public function getQuestion_get($id) {
        if (!$id) {
            $this->response([
                'error' => 'Missing question ID'
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }
    
        $question = $this->question_model->get_question_with_details($id);
        if ($question) {
            $this->response($question, REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'error' => 'Question not found'
            ], REST_Controller::HTTP_NOT_FOUND);
        }
    }
    
    // this function receives the data related to new answer and saves the answer in the db
    public function postAnswer_post() {
        $user_id = $this->session->userdata('logged_in');
        if (!$user_id) {
            $this->response([
                'success' => false, 
                'error' => 'Unauthorized'], REST_Controller::HTTP_UNAUTHORIZED);
            return;
        }
    
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            $this->response([
                'success' => false, 
                'error' => 'Invalid input provided'
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }
    
        $data['user_id'] = $user_id;
        $data['question_id'] = $this->post('question_id');
        $data['content'] = $this->post('content');
    
        if ($answer_id = $this->answer_model->set_answer($data)) {
            $this->response([
                'success' => true, 
                'message' => 'Answer created successfully', 
                'id' => $answer_id
            ], REST_Controller::HTTP_CREATED);
        } else {
            $this->response([
                'success' => false, 
                'error' => 'Failed to create answer'
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    

    // this function receives the data related to a new comment for an answer and saves the comment in the db
    public function postComment_post() {
        $answer_id = $this->post('answer_id');
        $user_id = $this->session->userdata('logged_in');

        if (!$user_id) {
            $this->response([
                'error' => 'Unauthorized'
            ], REST_Controller::HTTP_UNAUTHORIZED);
            return;
        }

        $content = $this->post('content');
        if (!$content) {
            $this->response([
                'error' => 'No content provided'
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $comment_data = [
            'answer_id' => $answer_id,
            'user_id' => $user_id,
            'content' => $content
        ];

        if ($this->comment_model->add_comment($comment_data)) {
            $this->response([
                'success' => true, 
                'message' => 'Comment added successfully'
            ], REST_Controller::HTTP_CREATED);
        } else {
            $this->response([
                'success' => false, 
                'error' => 'Failed to add comment'
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // this function handles incrementing vote for an answer
    public function incrementVote_post($answer_id) {
        $user_id = $this->session->userdata('logged_in');
        if (!$user_id) {
            $this->response([
                'error' => 'Unauthorized'
            ], REST_Controller::HTTP_OK);
            return;
        }
    
        if ($this->answer_model->increment_vote($answer_id, $user_id)) {
            $this->response([
                'message' => 'Vote incremented'
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'error' => 'Cannot vote more than once!'
            ], REST_Controller::HTTP_OK);
        }
    }
    
    // this function handles decrementing vote for an answer
    public function decrementVote_post($answer_id) {
        $user_id = $this->session->userdata('logged_in');
        if (!$user_id) {
            $this->response([
                'error' => 'Unauthorized'
            ], REST_Controller::HTTP_OK);
            return;
        }
    
        if ($this->answer_model->decrement_vote($answer_id, $user_id)) {
            $this->response([
                'message' => 'Vote decremented'
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'error' => 'Cannot vote more than once or vote below zero!'
            ], REST_Controller::HTTP_OK);
        }
    }   
    
    // this function handles the answer accepting mechanism 
    public function acceptAnswer_post() {
        $user_id = $this->session->userdata('logged_in');
        $answer_id = $this->post('answer_id');
    
        if (!$user_id) {
            $this->response([
                'error' => 'Unauthorized'
            ], REST_Controller::HTTP_UNAUTHORIZED);
            return;
        }
    
        // Verify that the user is the question's creator
        $question_id = $this->answer_model->get_question_id_by_answer($answer_id);
        $is_creator = $this->answer_model->is_creator($user_id, $question_id);
    
        $result = $this->answer_model->accept_answer($answer_id, $user_id);
        if ($result) {
            $this->response([
                'message' => 'Answer accepted'
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'error' => 'Failed to accept answer'
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // this function fetches an answer with details (with comments)
    public function getAnswer_get($answer_id = NULL) {
        if (!$answer_id) {
            $this->response([
                'error' => 'Missing answer ID'
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }
    
        $answer = $this->answer_model->get_answer_with_details($answer_id);
        if ($answer) {
            $this->response($answer, REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'error' => 'Answer not found'
            ], REST_Controller::HTTP_NOT_FOUND);
        }
    }
}
?>
