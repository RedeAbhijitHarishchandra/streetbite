package com.streetbite.controller;

import com.streetbite.model.User;
import com.streetbite.repository.UserRepository;
import com.streetbite.service.ZodiacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/zodiac")
public class ZodiacController {

    @Autowired
    private ZodiacService zodiacService;

    @Autowired
    private UserRepository userRepository;

    // Get horoscope for any sign (no auth required for exploration)
    @GetMapping("/sign/{signName}")
    public ResponseEntity<?> getHoroscopeBySign(@PathVariable String signName) {
        return ResponseEntity.ok(zodiacService.getDailyHoroscope(signName));
    }

    @GetMapping("/today")
    public ResponseEntity<?> getDailyHoroscope(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        if (user.getZodiacSign() == null) {
            return ResponseEntity.ok(Map.of("zodiacSign", "NOT_SET"));
        }

        return ResponseEntity.ok(zodiacService.getDailyHoroscope(user.getZodiacSign()));
    }

    @PostMapping("/sign")
    public ResponseEntity<?> setZodiacSign(@RequestBody Map<String, String> payload, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        String sign = payload.get("sign");
        if (sign == null || sign.isEmpty()) {
            return ResponseEntity.badRequest().body("Sign is required");
        }

        User updatedUser = zodiacService.updateUserZodiac(user.getId(), sign);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/challenge/complete")
    public ResponseEntity<?> completeChallenge(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        User updatedUser = zodiacService.completeChallenge(user.getId());
        return ResponseEntity.ok(Map.of("message", "Challenge completed", "xp", updatedUser.getXp()));
    }
}
