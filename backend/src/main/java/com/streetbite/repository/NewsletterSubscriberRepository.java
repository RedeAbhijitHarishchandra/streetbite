package com.streetbite.repository;

import com.streetbite.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {

    boolean existsByEmail(String email);

    Optional<NewsletterSubscriber> findByEmail(String email);

    Optional<NewsletterSubscriber> findByUnsubscribeToken(String token);
}
