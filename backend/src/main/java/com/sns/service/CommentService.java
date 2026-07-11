package com.sns.service;

import com.sns.dto.CommentResponse;
import com.sns.entity.*;
import com.sns.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public List<CommentResponse> getComments(Long postId) {
        return commentRepository
                .findByPostIdAndParentCommentIsNullOrderByCreatedAtAsc(postId)
                .stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());
    }

    public CommentResponse addComment(Long postId, String email, String content) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        Comment comment = Comment.builder()
                .post(post).user(user).content(content).build();
        return CommentResponse.from(commentRepository.save(comment));
    }

    public CommentResponse addReply(Long commentId, String email, String content) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Comment parent = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        Comment reply = Comment.builder()
                .post(parent.getPost())
                .user(user)
                .parentComment(parent)
                .content(content)
                .build();
        return CommentResponse.from(commentRepository.save(reply));
    }

    public void deleteComment(Long commentId, String email) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        if (!comment.getUser().getEmail().equals(email)) {
            throw new IllegalStateException("Not authorized");
        }
        commentRepository.delete(comment);
    }
}
