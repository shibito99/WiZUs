package com.sns.service;

import com.sns.dto.UserResponse;
import com.sns.entity.*;
import com.sns.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final S3Service s3Service;

    public Long findIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"))
                .getId();
    }

    public UserResponse getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toResponse(user);
    }

    public UserResponse updateProfile(String email, String bio, MultipartFile avatar) {
        User user = userRepository.findByEmail(email).orElseThrow();
        if (bio != null) user.setBio(bio);
        if (avatar != null && !avatar.isEmpty()) {
            user.setAvatarUrl(s3Service.upload(avatar));
        }
        return toResponse(userRepository.save(user));
    }

    public void follow(Long targetId, String email) {
        User follower = userRepository.findByEmail(email).orElseThrow();
        User followee = userRepository.findById(targetId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!followRepository.existsByFollowerIdAndFolloweeId(follower.getId(), targetId)) {
            followRepository.save(Follow.builder().follower(follower).followee(followee).build());
        }
    }

    public void unfollow(Long targetId, String email) {
        User follower = userRepository.findByEmail(email).orElseThrow();
        followRepository.findByFollowerIdAndFolloweeId(follower.getId(), targetId)
                .ifPresent(followRepository::delete);
    }

    public List<UserResponse> getFollowing(Long userId) {
        return followRepository.findByFollowerId(userId).stream()
                .map(f -> toResponse(f.getFollowee()))
                .collect(Collectors.toList());
    }

    public List<UserResponse> getFollowers(Long userId) {
        return followRepository.findByFolloweeId(userId).stream()
                .map(f -> toResponse(f.getFollower()))
                .collect(Collectors.toList());
    }

    public List<UserResponse> searchUsers(String keyword, Long currentUserId) {
        return userRepository.findByUsernameContainingIgnoreCase(keyword).stream()
                .filter(u -> !u.getId().equals(currentUserId))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<UserResponse> getSuggestions(Long currentUserId) {
        List<User> candidates = followRepository.findSuggestionsByFollowNetwork(currentUserId);
        if (candidates.isEmpty()) {
            candidates = followRepository.findSuggestionsByFollowerCount(currentUserId);
        }
        return candidates.stream()
                .limit(10)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private UserResponse toResponse(User user) {
        long following = followRepository.countByFollowerId(user.getId());
        long followers = followRepository.countByFolloweeId(user.getId());
        return UserResponse.from(user, following, followers);
    }
}
