package com.sns.repository;

import com.sns.entity.Follow;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerIdAndFolloweeId(Long followerId, Long followeeId);
    Optional<Follow> findByFollowerIdAndFolloweeId(Long followerId, Long followeeId);
    List<Follow> findByFollowerId(Long followerId);
    List<Follow> findByFolloweeId(Long followeeId);
    long countByFollowerId(Long followerId);
    long countByFolloweeId(Long followeeId);

    // 友達の友達: 自分のフォロー中ユーザーがフォローしている人のうち、自分がまだフォローしていない人
    @Query("""
        SELECT f2.followee FROM Follow f1
        JOIN Follow f2 ON f1.followee.id = f2.follower.id
        WHERE f1.follower.id = :userId
          AND f2.followee.id <> :userId
          AND f2.followee.id NOT IN (
              SELECT f3.followee.id FROM Follow f3 WHERE f3.follower.id = :userId
          )
        GROUP BY f2.followee
        ORDER BY COUNT(f2.followee) DESC
        """)
    List<User> findSuggestionsByFollowNetwork(@Param("userId") Long userId);

    // フォロワー数上位（フォロー0人時のフォールバック）
    @Query("""
        SELECT f.followee FROM Follow f
        WHERE f.followee.id <> :userId
          AND f.followee.id NOT IN (
              SELECT f2.followee.id FROM Follow f2 WHERE f2.follower.id = :userId
          )
        GROUP BY f.followee
        ORDER BY COUNT(f.followee) DESC
        """)
    List<User> findSuggestionsByFollowerCount(@Param("userId") Long userId);
}
