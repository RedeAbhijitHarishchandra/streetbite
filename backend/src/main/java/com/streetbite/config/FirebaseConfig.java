package com.streetbite.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.credentials.path:}")
    private String firebaseConfigPath;

    @PostConstruct
    public void initialize() {
        try {
            // Check if already initialized
            List<FirebaseApp> apps = FirebaseApp.getApps();
            if (apps != null && !apps.isEmpty()) {
                logger.info("Firebase already initialized");
                return;
            }

            // Try to load from environment variable path first
            if (firebaseConfigPath != null && !firebaseConfigPath.isEmpty()) {
                try (InputStream fileServiceAccount = new FileInputStream(firebaseConfigPath)) {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(fileServiceAccount))
                            .build();

                    FirebaseApp.initializeApp(options);
                    logger.info("✓ Firebase initialized successfully from: {}", firebaseConfigPath);
                    return;
                } catch (Exception e) {
                    logger.debug("Could not load Firebase from path: {}", firebaseConfigPath);
                }
            }

            // Try classpath as fallback
            try (InputStream classpathServiceAccount = getClass().getClassLoader()
                    .getResourceAsStream("firebase-key.json")) {
                if (classpathServiceAccount != null) {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(classpathServiceAccount))
                            .build();

                    FirebaseApp.initializeApp(options);
                    logger.info("✓ Firebase initialized successfully from classpath");
                    return;
                }
            } catch (Exception e) {
                logger.debug("Could not load Firebase from classpath");
            }

            // If we get here, Firebase is not configured
            logger.warn("⚠ Firebase credentials not found - Firestore features will be disabled");
            logger.info("To enable Firebase:");
            logger.info("  1. Add firebase-key.json to the project root, OR");
            logger.info("  2. Set GOOGLE_APPLICATION_CREDENTIALS environment variable");

        } catch (Exception e) {
            // Catch any unexpected errors but don't block application startup
            logger.error("Failed to initialize Firebase (non-fatal): {}", e.getMessage());
            logger.info("Application will continue without Firebase/Firestore features");
        }
    }
}
