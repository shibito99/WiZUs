package com.sns.controller;

import com.sns.dto.*;
import com.sns.repository.UserRepository;
import com.sns.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final LikeService likeService;
    private final CommentService commentService;
    private final UserRepository userRepository;

    @GetMapping("/posts")
    public ResponseEntity<Page<PostResponse>> getTimeline(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails principal) {
        Long userId = getCurrentUserId(principal);
        return ResponseEntity.ok(postService.getTimeline(page, size, userId));
    }

    @PostMapping("/posts")
    public ResponseEntity<PostResponse> createPost(
            @RequestParam String content,
            @RequestParam(required = false) MultipartFile image,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(postService.createPost(principal.getUsername(), content, image));
    }

    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        postService.deletePost(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/posts/{id}/likes")
    public ResponseEntity<Map<String, Long>> like(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        long count = likeService.like(id, principal.getUsername());
        return ResponseEntity.ok(Map.of("likeCount", count));
    }

    @DeleteMapping("/posts/{id}/likes")
    public ResponseEntity<Map<String, Long>> unlike(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        long count = likeService.unlike(id, principal.getUsername());
        return ResponseEntity.ok(Map.of("likeCount", count));
    }

    @GetMapping("/posts/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getComments(id));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(commentService.addComment(id, principal.getUsername(), body.get("content")));
    }

    @PostMapping("/comments/{id}/replies")
    public ResponseEntity<CommentResponse> addReply(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(commentService.addReply(id, principal.getUsername(), body.get("content")));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        commentService.deleteComment(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentUserId(UserDetails principal) {
        if (principal == null) return null;
        return userRepository.findByEmail(principal.getUsername())
                .map(u -> u.getId()).orElse(null);
    }
}
