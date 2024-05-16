<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class Questions extends REST_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('question_model');
        $this->load->helper('url');
    }

    // retrieves all the questions
    public function allQuestions_get() {
        $search = $this->get('search');
        $tag = $this->get('tag');  
    $questions = $this->question_model->get_questions($search, $tag);
        $this->response($questions, REST_Controller::HTTP_OK);
    }

    // retrieves a question with details based on given id
    public function getQuestion_get($id = NULL) {
        $question = $this->question_model->get_question_with_details($id);
        if (!$question) {
            $this->response([
                'message' => 'Question not found'
            ], REST_Controller::HTTP_NOT_FOUND);
        } else {
            $this->response($question, REST_Controller::HTTP_OK);
        }
    }

    // this function handles the post question functionality
    public function postQuestion_post() {
        if (!$this->session->userdata('logged_in')) {
            $this->response([
                'success' => false, 'error' => 'Unauthorized'
            ], REST_Controller::HTTP_UNAUTHORIZED);
            return;
        }
    
        $data = json_decode(file_get_contents('php://input'), true);
        $data['user_id'] = $this->session->userdata('logged_in');
        $tags = isset($data['tags']) ? $data['tags'] : [];
        unset($data['tags']);
    
        $mandatoryFields = ['title', 'content'];  
    
        $emptyFields = array_filter($mandatoryFields, function($field) use ($data) {
            return empty($data[$field]);
        });
    
        // Checking if there are any empty mandatory fields
        if (!empty($emptyFields)) {
            $this->response([
                'success' => false, 
                'message' => 'Missing or empty required fields',
                'missing_fields' => $emptyFields
            ], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }
    
        if ($question_id = $this->question_model->set_question($data)) {
            $this->load->model('tag_model');
            foreach ($tags as $tag) {
                $tag_id = $this->tag_model->ensureTagExists($tag);
                $this->tag_model->linkTagToQuestion($tag_id, $question_id);
            }
            $this->response([
                'success' => true, 
                'message' => 'Question created successfully', 
                'question_id' => $question_id
            ], REST_Controller::HTTP_CREATED);
        } else {
            $this->response(['success' => false, 'error' => 'Failed to create question'], REST_Controller::HTTP_BAD_REQUEST);
        }
    }    
    

    // this function handles the updates of a question
    public function updateQuestion_put($id) {
        if (!$this->session->userdata('logged_in')) {
            $this->response([
                'success' => false, 'error' => 'Unauthorized'
            ], REST_Controller::HTTP_UNAUTHORIZED);
            return;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if ($this->question_model->update_question($id, $data)) {
            $this->response([
                'success' => true, 
                'message' => 'Question updated successfully'
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'success' => false, 
                'message' => 'Failed to update question'
            ], REST_Controller::HTTP_BAD_REQUEST);
        }
    }

    // this function handles the deletion of a question
    public function deleteQuestion_delete($id) {
        $question = $this->question_model->get_question_by_id($id);
        if (!$question) {
            $this->response([
                'success' => false,
                'message' => 'Question not found'
            ], REST_Controller::HTTP_NOT_FOUND);
            return;
        }
    
        $deleted = $this->question_model->delete_question($id);
        if ($deleted) {
            $this->response([
                'success' => true,
                'message' => 'Question deleted successfully'
            ], REST_Controller::HTTP_OK);
        } else {
            $this->response([
                'success' => false,
                'message' => 'Failed to delete question'
            ], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
?>