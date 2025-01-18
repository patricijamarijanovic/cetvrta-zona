package com.example.backend.controller;

import com.example.backend.dto.ComplaintResponseDto;
import com.example.backend.dto.ComplaintsAdminDto;
import com.example.backend.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:5173", "https://volontirajsnama.onrender.com"})
public class AdminController {
    @Autowired
    private ComplaintService complaintService;

    @GetMapping("/admin/home")
    public String home() {
        return "ADMIN home";
    }

    @GetMapping("/admin/in-progress-complaints")
    public List<ComplaintsAdminDto> complaints() {
        return complaintService.complaints_in_progress();
    }

    @GetMapping("/admin/complaint/{complaintId}")
    public ComplaintsAdminDto specific_complaint(@PathVariable Long complaintId) {
        return complaintService.specific_complaint(complaintId);
    }

    @PostMapping("/admin/resolved/{complaintId}")
    public String mark_as_resolved(@PathVariable Long complaintId) {
        return complaintService.mark_as_resolved(complaintId);
    }

    @PostMapping("/admin/respond/{complaintId}")
    public String respond_to_complaint(@PathVariable Long complaintId, @RequestBody ComplaintResponseDto dto) {
        return complaintService.respond_to_complaint(complaintId, dto);
    }


}