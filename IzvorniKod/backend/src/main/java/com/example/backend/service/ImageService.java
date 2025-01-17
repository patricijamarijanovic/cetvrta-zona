package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class ImageService {
    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private VolunteerPictureRepository volunteerPictureRepository;

    @Autowired
    private OrganizationPictureRepository organizationPictureRepository;

    public Long saveImage(MultipartFile file) throws IOException {
        Image image = new Image();
        image.setName(file.getOriginalFilename());
        image.setType(file.getContentType());
        image.setData(file.getBytes());
        imageRepository.save(image);

        return image.getId();
    }

    public Long saveProfileImageVol(MultipartFile file) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Volunteer vol = volunteerRepository.findByUsername(username);

        Optional<VolunteerPicture> o = volunteerPictureRepository.findByVolunteerId(vol.getId());
        if (o.isPresent()) {
            VolunteerPicture volunteerPicture = o.get();
            volunteerPictureRepository.delete(volunteerPicture);
        }

        Image image = new Image();
        image.setName(file.getOriginalFilename());
        image.setType(file.getContentType());
        image.setData(file.getBytes());
        imageRepository.save(image);

        VolunteerPicture vp = new VolunteerPicture();
        vp.setVolunteerId(vol.getId());
        vp.setImageId(image.getId());
        volunteerPictureRepository.save(vp);

        return image.getId();
    }


    public Long saveProfileImageOrg(MultipartFile file) throws IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Organization org = organizationRepository.findByUsername(username);

        Optional<OrganizationPicture> o = organizationPictureRepository.findByOrganizationId(org.getId());
        if (o.isPresent()) {
            OrganizationPicture organizationPicture = o.get();
            organizationPictureRepository.delete(organizationPicture);
        }

        Image image = new Image();
        image.setName(file.getOriginalFilename());
        image.setType(file.getContentType());
        image.setData(file.getBytes());
        imageRepository.save(image);

        OrganizationPicture op = new OrganizationPicture();
        op.setOrganizationId(org.getId());
        op.setImageId(image.getId());
        organizationPictureRepository.save(op);

        return image.getId();
    }


    // Dohvat slike prema ID-u
    public Image getImage(Long id) throws Exception {
        Optional<Image> imageOptional = imageRepository.findById(id);

        // Ako slika postoji, vratit ćemo je, inače baciti iznimku
        if (imageOptional.isPresent()) {
            return imageOptional.get();
        } else {
            throw new Exception("Image not found with ID: " + id);
        }
    }
}
