<?php
class Tag_model extends CI_Model {
    
    public function set_question_tags($question_id, $tags) {
        $tagData = [];
        foreach ($tags as $tag) {
            $tagData[] = [
                'question_id' => $question_id,
                'tag_id' => $this->ensureTagExists($tag) 
            ];
        }
        $this->db->insert_batch('QuestionTag', $tagData); 
    }

    private function ensureTagExists($tag_name) {
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
}
?>