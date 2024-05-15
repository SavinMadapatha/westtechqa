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

    public function allQuestions_get() {
        $search = $this->get('search');
        $tag = $this->get('tag');  
    $questions = $this->question_model->get_questions($search, $tag);
        $this->response($questions, REST_Controller::HTTP_OK);
    }

    public function getQuestion_get($id = NULL) {
        $question = $this->question_model->get_question_with_details($id);
        if (!$question) {
            $this->response(['message' => 'Question not found'], REST_Controller::HTTP_NOT_FOUND);
        } else {
            $this->response($question, REST_Controller::HTTP_OK);
        }
    }

    public function postQuestion_post() {
        if (!$this->session->userdata('logged_in')) {
            $this->response(['success' => false, 'error' => 'Unauthorized'], REST_Controller::HTTP_UNAUTHORIZED);
            return;
        }
    
        $data = json_decode(file_get_contents('php://input'), true);
        $data['user_id'] = $this->session->userdata('logged_in');
        $tags = isset($data['tags']) ? $data['tags'] : [];
        unset($data['tags']);
    
        if ($question_id = $this->question_model->set_question($data)) {
            $this->load->model('tag_model');
            foreach ($tags as $tag) {
                $tag_id = $this->tag_model->ensureTagExists($tag);
                $this->tag_model->linkTagToQuestion($tag_id, $question_id); 
            }
            $this->response(['success' => true, 'message' => 'Question created successfully', 'question_id' => $question_id], REST_Controller::HTTP_CREATED);
        } else {
            $this->response(['success' => false, 'error' => 'Failed to create question'], REST_Controller::HTTP_BAD_REQUEST);
        }
    }
    
}
?>