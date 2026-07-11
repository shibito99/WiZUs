package com.sns.dto;

import com.sns.entity.Post;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostResponse {
    private Long id;
    private Long userId;
    private String username;
    private String avatarUrl;
    private String content;
    private String imageUrl;
    private long likeCount;
    private long commentCount;
    private boolean likedByMe;
    private LocalDateTime createdAt;

    public static PostResponse from(Post post, long likeCount, long commentCount, boolean likedByMe) {
        PostResponse r = new PostResponse();
        r.id = post.getId();
        r.userId = post.getUser().getId();
        r.username = post.getUser().getUsername();
        r.avatarUrl = post.getUser().getAvatarUrl();
        r.content = post.getContent();
        r.imageUrl = post.getImageUrl();
        r.likeCount = likeCount;
        r.commentCount = commentCount;
        r.likedByMe = likedByMe;
        r.createdAt = post.getCreatedAt();
        return r;
    }
}
