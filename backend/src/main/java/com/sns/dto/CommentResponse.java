package com.sns.dto;

import com.sns.entity.Comment;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CommentResponse {
    private Long id;
    private Long userId;
    private String username;
    private String avatarUrl;
    private String content;
    private List<CommentResponse> replies;
    private LocalDateTime createdAt;

    public static CommentResponse from(Comment comment) {
        CommentResponse r = new CommentResponse();
        r.id = comment.getId();
        r.userId = comment.getUser().getId();
        r.username = comment.getUser().getUsername();
        r.avatarUrl = comment.getUser().getAvatarUrl();
        r.content = comment.getContent();
        r.createdAt = comment.getCreatedAt();
        r.replies = comment.getReplies().stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());
        return r;
    }
}
