package com.sns.dto;

import com.sns.entity.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private String bio;
    private long followingCount;
    private long followerCount;
    private LocalDateTime createdAt;

    public static UserResponse from(User user, long followingCount, long followerCount) {
        UserResponse r = new UserResponse();
        r.id = user.getId();
        r.username = user.getUsername();
        r.email = user.getEmail();
        r.avatarUrl = user.getAvatarUrl();
        r.bio = user.getBio();
        r.followingCount = followingCount;
        r.followerCount = followerCount;
        r.createdAt = user.getCreatedAt();
        return r;
    }
}
