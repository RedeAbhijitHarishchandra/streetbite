package com.streetbite.controller;

import com.streetbite.model.User;
import com.streetbite.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userUpdates) {
        return userService.getUserById(id)
                .map(existingUser -> {
                    if (userUpdates.getDisplayName() != null)
                        existingUser.setDisplayName(userUpdates.getDisplayName());
                    if (userUpdates.getPhoneNumber() != null)
                        existingUser.setPhoneNumber(userUpdates.getPhoneNumber());
                    if (userUpdates.getProfilePicture() != null)
                        existingUser.setProfilePicture(userUpdates.getProfilePicture());

                    User saved = userService.saveUser(existingUser);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
