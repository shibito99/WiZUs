package com.sns.controller;

import com.sns.dto.*;
import com.sns.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PostService postService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile avatar,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(userService.updateProfile(principal.getUsername(), bio, avatar));
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<Page<PostResponse>> getUserPosts(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails principal) {
        Long currentUserId = principal != null ? userService.getUser(id).getId() : null;
        return ResponseEntity.ok(postService.getUserPosts(id, page, size, currentUserId));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> follow(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        userService.follow(id, principal.getUsername());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/follow")
    public ResponseEntity<Void> unfollow(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        userService.unfollow(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<List<UserResponse>> getFollowing(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getFollowing(id));
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<List<UserResponse>> getFollowers(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getFollowers(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> search(
            @RequestParam String q,
            @AuthenticationPrincipal UserDetails principal) {
        Long currentUserId = userService.findIdByEmail(principal.getUsername());
        return ResponseEntity.ok(userService.searchUsers(q, currentUserId));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<UserResponse>> getSuggestions(
            @AuthenticationPrincipal UserDetails principal) {
        Long currentUserId = userService.findIdByEmail(principal.getUsername());
        return ResponseEntity.ok(userService.getSuggestions(currentUserId));
    }
}
