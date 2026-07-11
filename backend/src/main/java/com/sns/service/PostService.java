package com.sns.service;

import com.sns.dto.PostResponse;
import com.sns.entity.Post;
import com.sns.entity.User;
import com.sns.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;
    private final S3Service s3Service;

    public Page<PostResponse> getTimeline(int page, int size, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size);
        // フォロー中ユーザーのID一覧 + 自分のIDを含める
        List<Long> targetUserIds = followRepository.findByFollowerId(currentUserId).stream()
                .map(f -> f.getFollowee().getId())
                .collect(Collectors.toList());
        targetUserIds.add(currentUserId);
        return postRepository.findByUserIdInOrderByCreatedAtDesc(targetUserIds, pageable)
                .map(p -> toResponse(p, currentUserId));
    }

    public Page<PostResponse> getUserPosts(Long userId, int page, int size, Long currentUserId) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(p -> toResponse(p, currentUserId));
    }

    public PostResponse createPost(String email, String content, MultipartFile image) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String imageUrl = (image != null && !image.isEmpty()) ? s3Service.upload(image) : null;
        Post post = Post.builder()
                .user(user)
                .content(content)
                .imageUrl(imageUrl)
                .build();
        postRepository.save(post);
        return toResponse(post, user.getId());
    }

    public void deletePost(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        if (!post.getUser().getEmail().equals(email)) {
            throw new IllegalStateException("Not authorized");
        }
        postRepository.delete(post);
    }

    private PostResponse toResponse(Post post, Long currentUserId) {
        long likeCount = likeRepository.countByPostId(post.getId());
        long commentCount = commentRepository.countByPostId(post.getId());
        boolean likedByMe = currentUserId != null &&
                likeRepository.existsByUserIdAndPostId(currentUserId, post.getId());
        return PostResponse.from(post, likeCount, commentCount, likedByMe);
    }
}
