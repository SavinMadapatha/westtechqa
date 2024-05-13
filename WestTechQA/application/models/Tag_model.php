<?php
class Tag_model extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    // This function ensures tags exist and links them to the question
    public function set_question_tags($question_id, $tags) {
        $this->db->trans_start(); 

        foreach ($tags as $tag_name) {
            $tag_id = $this->ensureTagExists($tag_name);
            if ($tag_id) {
                $this->linkTagToQuestion($tag_id, $question_id);
            }
        }

        $this->db->trans_complete(); 

        if ($this->db->trans_status() === FALSE) {
            log_message('error', 'Failed to set tags for question ID: ' . $question_id);
            return false;
        }

        return true;
    }

    // This functions ensure a tag exists in the database, or create it if it does not
    public function ensureTagExists($tag_name) {
        $this->db->select('tag_id');
        $this->db->from('Tag');
        $this->db->where('tag_name', $tag_name);
        $tag = $this->db->get()->row();

        if (!$tag) {
            $this->db->insert('Tag', ['tag_name' => $tag_name]);
            return $this->db->insert_id();
        }

        return $tag->tag_id;
    }

    public function linkTagToQuestion($tag_id, $question_id) {
        $data = [
            'tag_id' => $tag_id,
            'question_id' => $question_id
        ];
        $this->db->insert('QuestionTag', $data);
        if ($this->db->affected_rows() == 0) {
            log_message('error', "Failed to link tag $tag_id to question $question_id");
            return false;
        }
        return true;
    }
}
?>
