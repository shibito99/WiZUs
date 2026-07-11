package com.sns.service;

import com.sns.entity.*;
import com.sns.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public long like(Long postId, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        if (!likeRepository.existsByUserIdAndPostId(user.getId(), postId)) {
            likeRepository.save(Like.builder().user(user).post(post).build());
        }
        return likeRepository.countByPostId(postId);
    }

    public long unlike(Long postId, String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        likeRepository.findByUserIdAndPostId(user.getId(), postId)
                .ifPresent(likeRepository::delete);
        return likeRepository.countByPostId(postId);
    }
}
