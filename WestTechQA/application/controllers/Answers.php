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

    public function getQuestion_get($id) {
        if (!$id) {
            $this->response(['error' => 'Missing question ID'], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }
    
        $question = $this->question_model->get_question_with_details($id);
        if ($question) {
            $this->response($question, REST_Controller::HTTP_OK);
        } else {
            $this->response(['error' => 'Question not found'], REST_Controller::HTTP_NOT_FOUND);
        }
    }
    
    // this function receives the data related to new answer and saves the answer in the db
    public function postAnswer_post() {
        log_message('debug', 'postAnswer_post method called.');
        $user_id = $this->session->userdata('logged_in');
        if (!$user_id) {
            $this->response(['error' => 'Unauthorized'], REST_Controller::HTTP_UNAUTHORIZED);
            return;
        }
        
    
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            $this->response(['error' => 'Invalid input provided'], REST_Controller::HTTP_BAD_REQUEST);
            return;
        }
    
        $data['user_id'] = $user_id;
        $data['question_id'] = $this->post('question_id');  
        $data['content'] = $this->post('content');
    
        if ($answer_id = $this->answer_model->set_answer($data)) {
            $this->response(['message' => 'Answer created successfully', 'id' => $answer_id], REST_Controller::HTTP_CREATED);
        } else {
            $this->response(['error' => 'Failed to create answer'], REST_Controller::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
?>