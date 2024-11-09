package com.example.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name ="prijava")
public class Prijava {
	@SequenceGenerator(name = "prijava_seq", sequenceName = "prijava_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "prijava_seq")
	@Id
	private Long prijavaID;
	private LocalDateTime datumprijave;
	private String statusprijave;
	private Integer projektID;
	private Long volunteerID;
	
	public Prijava() {}
	
	public Long getPrijavaID() {
		return prijavaID;
	}
	public void setPrijavaID(Long prijavaID) {
		this.prijavaID = prijavaID;
	}
	public LocalDateTime getDatumprijave() {
		return datumprijave;
	}
	public void setDatumprijave(LocalDateTime datumprijave) {
		this.datumprijave = datumprijave;
	}
	public String getStatusprijave() {
		return statusprijave;
	}
	public void setStatusprijave(String statusprijave) {
		this.statusprijave = statusprijave;
	}
	public Integer getProjektID() {
		return projektID;
	}
	public void setProjektID(Integer projektID) {
		this.projektID = projektID;
	}
	public Long getVolunteerID() {
		return volunteerID;
	}
	public void setVolunteerID(Long volunteerID) {
		this.volunteerID = volunteerID;
	}
	@Override
	public String toString() {
		return "Prijava [prijavaID=" + prijavaID + ", datumprijave=" + datumprijave + ", statusprijave=" + statusprijave
				+ ", projektID=" + projektID + ", volunteerID=" + volunteerID + "]";
	}
	
}
