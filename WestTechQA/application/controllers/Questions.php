<?php
class Questions extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('question_model');
        $this->load->helper('url');

        // Allow from any origin
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    }

    // Handle all requests to this controller
    public function _remap($method, $params = []) {
        $method = strtolower($this->input->server('REQUEST_METHOD'));
        if (method_exists($this, $method)) {
            return call_user_func_array([$this, $method], $params);
        }
        $this->output->set_status_header(405); // Method Not Allowed
        echo json_encode(['error' => 'Method Not Allowed']);
    }

    // GET: List all questions or view a single question
    public function get($id = NULL) {
        if ($id === NULL) {
            $questions = $this->question_model->get_questions();
            $this->output->set_content_type('application/json')
                         ->set_output(json_encode($questions));
        } else {
            $question = $this->question_model->get_question($id);
            if (!$question) {
                $this->output->set_status_header(404)
                             ->set_output(json_encode(['message' => 'Question not found']));
            } else {
                $this->output->set_content_type('application/json')
                             ->set_output(json_encode($question));
            }
        }
    }

    // POST: Create a new question
    public function post() {
        $data = json_decode(file_get_contents('php://input'), true);
        if ($this->question_model->set_question($data)) {
            $this->output->set_status_header(201) // HTTP 201 Created
                         ->set_output(json_encode(['message' => 'Question created successfully']));
        } else {
            $this->output->set_status_header(400) // HTTP 400 Bad Request
                         ->set_output(json_encode(['error' => 'Failed to create question']));
        }
    }

    // PUT: Update an existing question
    public function put($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        if ($this->question_model->update_question($id, $data)) {
            $this->output->set_status_header(200) // HTTP 200 OK
                         ->set_output(json_encode(['message' => 'Question updated successfully']));
        } else {
            $this->output->set_status_header(400) // HTTP 400 Bad Request
                         ->set_output(json_encode(['error' => 'Failed to update question']));
        }
    }

    // DELETE: Delete a question
    public function delete($id) {
        if ($this->question_model->delete_question($id)) {
            $this->output->set_status_header(200) // HTTP 200 OK
                         ->set_output(json_encode(['message' => 'Question deleted successfully']));
        } else {
            $this->output->set_status_header(400) // HTTP 400 Bad Request
                         ->set_output(json_encode(['error' => 'Failed to delete question']));
        }
    }
}
