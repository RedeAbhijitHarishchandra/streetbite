package com.streetbite.service;

import com.streetbite.model.Vendor;
import com.streetbite.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VendorService {

    @Autowired
    private com.streetbite.repository.ReviewRepository reviewRepository;

    @Autowired
    private com.streetbite.repository.FavoriteRepository favoriteRepository;

    @Autowired
    private com.streetbite.repository.OrderRepository orderRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Transactional
    public Vendor saveVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public List<Vendor> getActiveVendors() {
        return vendorRepository.findByIsActiveTrue();
    }

    public Optional<Vendor> getVendorById(Long id) {
        return vendorRepository.findById(id);
    }

    public List<Vendor> getVendorsByOwner(Long ownerId) {
        return vendorRepository.findByOwnerId(ownerId);
    }

    @Transactional
    public void deleteVendor(Long id) {
        // Manually cascade delete related entities
        reviewRepository.deleteByVendorId(id);
        favoriteRepository.deleteByVendorId(id);
        orderRepository.deleteByVendorId(id);

        // Finally delete the vendor
        vendorRepository.deleteById(id);
    }
}
