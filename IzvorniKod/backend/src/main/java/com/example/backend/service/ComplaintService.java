package com.example.backend.service;

import com.example.backend.dto.ComplaintResponseDto;
import com.example.backend.dto.ComplaintsAdminDto;
import com.example.backend.dto.SentComplaintDto;
import com.example.backend.dto.SentComplaintRegisteredDto;
import com.example.backend.model.Complaint;
import com.example.backend.model.ComplaintStatus;
import com.example.backend.model.Organization;
import com.example.backend.model.Volunteer;
import com.example.backend.repository.ComplaintRepository;
import com.example.backend.repository.OrganizationRepository;
import com.example.backend.repository.VolunteerRepository;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private EmailService emailService = new EmailService(new JavaMailSenderImpl());

    public String send_complaint_not_registered(SentComplaintDto dto){
        Complaint complaint = new Complaint();

        complaint.setTitle(dto.getTitle());
        complaint.setDescription(dto.getDescription());
        complaint.setDate(LocalDate.now());
        complaint.setEmail(dto.getEmail());
        complaint.setFirstName(dto.getFirstName());
        complaint.setLastName(dto.getLastName());
        complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        complaintRepository.save(complaint);

        return complaint.toString();
    }

    public String send_complaint_vol(SentComplaintRegisteredDto dto){
        // Get the currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Volunteer volunteer = volunteerRepository.findByUsername(username);

        Complaint complaint = new Complaint();

        complaint.setTitle(dto.getTitle());
        complaint.setDescription(dto.getDescription());
        complaint.setDate(LocalDate.now());
        complaint.setEmail(volunteer.getEmail());
        complaint.setFirstName(volunteer.getFirstName());
        complaint.setLastName(volunteer.getLastName());
        complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        complaintRepository.save(complaint);

        return complaint.toString();
    }

    public String send_complaint_org(SentComplaintRegisteredDto dto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Organization organization = organizationRepository.findByUsername(username);

        Complaint complaint = new Complaint();

        complaint.setTitle(dto.getTitle());
        complaint.setDescription(dto.getDescription());
        complaint.setDate(LocalDate.now());
        complaint.setEmail(organization.getEmail());
        complaint.setFirstName(organization.getOrganizationName());
        complaint.setLastName("");
        complaint.setStatus(ComplaintStatus.IN_PROGRESS);
        complaintRepository.save(complaint);

        return complaint.toString();
    }

    public List<ComplaintsAdminDto> complaints_in_progress(){
        List<ComplaintsAdminDto> lista = new ArrayList<>();

        complaintRepository.findAll().forEach(complaint -> {
            if (complaint.getStatus() == ComplaintStatus.IN_PROGRESS) {
                ComplaintsAdminDto dto = new ComplaintsAdminDto();
                dto.setId(complaint.getId());
                dto.setDate(complaint.getDate());
                dto.setTitle(complaint.getTitle());
                dto.setDescription(complaint.getDescription());
                dto.setEmail(complaint.getEmail());
                dto.setFirstName(complaint.getFirstName());
                dto.setLastName(complaint.getLastName());
                dto.setStatus(complaint.getStatus());
                lista.add(dto);
            }
        });
        return lista;
    }

    public ComplaintsAdminDto specific_complaint(Long complaintId){
        Complaint complaint =  complaintRepository.findById(complaintId).get();

        ComplaintsAdminDto dto = new ComplaintsAdminDto();
        dto.setId(complaint.getId());
        dto.setDate(complaint.getDate());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setEmail(complaint.getEmail());
        dto.setFirstName(complaint.getFirstName());
        dto.setLastName(complaint.getLastName());
        dto.setStatus(complaint.getStatus());

        return dto;
    }

    public String mark_as_resolved(Long complaintId){
        Complaint complaint =  complaintRepository.findById(complaintId).get();
        complaint.setStatus(ComplaintStatus.RESOLVED);
        complaintRepository.save(complaint);
        return complaint.toString();
    }

    public String respond_to_complaint(Long complaintId, ComplaintResponseDto dto){
        Complaint complaint = complaintRepository.findById(complaintId).get();
        String email = complaint.getEmail();
        String message = dto.getResponse();

        emailService.sendEmail(email, "Odgovor na pritužbu", message);

        return "odgovor poslan !";
    }


}
