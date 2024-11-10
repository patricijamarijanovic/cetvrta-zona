package com.example.backend.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name ="projects")
public class Project {
	@NotBlank
	private String naziv;
	
	@NotBlank
	private String opis;
	
	@NotNull
	private LocalDate pocetak;
	
	@NotNull
	private LocalDate kraj;
	
	@NotBlank
	private String lokacija;
	
	@NotNull
	private Integer brojprijavljenihvolontera;
	
	@NotNull
	private Integer maksbrojvolontera;
	
	@NotNull
	private String status;
	
	@SequenceGenerator(name = "project_seq", sequenceName = "project_seq", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_seq")
	@Id
	private Integer projektID;
	
	@NotNull
	private Boolean hitan;
	
	@NotNull
	private Long organizationID;
	
	/*
	 * public Project(@NotBlank String naziv, @NotBlank String opis, @NotNull
	 * LocalDate pocetak, @NotNull LocalDate kraj,
	 * 
	 * @NotBlank String lokacija, @NotNull Integer maksBrojVolontera, @NotNull
	 * Status status, @NotNull Boolean hitan,
	 * 
	 * @NotNull Long organizationID) { super(); this.naziv = naziv; this.opis =
	 * opis; this.pocetak = pocetak; this.kraj = kraj; this.lokacija = lokacija;
	 * this.maksbrojvolontera = maksBrojVolontera; this.status = status; this.hitan
	 * = hitan; this.organizationID = organizationID; this.brojprijavljenihvolontera
	 * = 0; }
	 */
	public String getNaziv() {
		return naziv;
	}
	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}
	public String getOpis() {
		return opis;
	}
	public void setOpis(String opis) {
		this.opis = opis;
	}
	public LocalDate getPocetak() {
		return pocetak;
	}
	public void setPocetak(LocalDate pocetak) {
		this.pocetak = pocetak;
	}
	public LocalDate getKraj() {
		return kraj;
	}
	public void setKraj(LocalDate kraj) {
		this.kraj = kraj;
	}
	public String getLokacija() {
		return lokacija;
	}
	public void setLokacija(String lokacija) {
		this.lokacija = lokacija;
	}
	public Integer getMaksBrojVolontera() {
		return maksbrojvolontera;
	}
	public void setMaksBrojVolontera(Integer maksBrojVolontera) {
		this.maksbrojvolontera = maksBrojVolontera;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Integer getProjektID() {
		return projektID;
	}
	public void setProjektID(Integer projectID) {
		this.projektID = projectID;
	}
	public void resetBrojprijavljenihvolontera() {
		this.brojprijavljenihvolontera = 0;
	}
	public Boolean getHitan() {
		return hitan;
	}
	public void setHitan(Boolean hitan) {
		this.hitan = hitan;
	}
	public Long getOrganizationID() {
		return organizationID;
	}
	public void setOrganizationID(Long organizationID) {
		this.organizationID = organizationID;
	}
	public void prijaviVolontera() throws Exception {
		if (brojprijavljenihvolontera < maksbrojvolontera) brojprijavljenihvolontera++;
		else throw new Exception("Mjesta su popunjena, nije moguce prijaviti novog volontera");
	}
	public void odbijVolontera() {
		brojprijavljenihvolontera--;
	}
	@Override
	public String toString() {
		return "Project [naziv=" + naziv + ", opis=" + opis + ", pocetak=" + pocetak + ", kraj=" + kraj + ", lokacija="
				+ lokacija + ", maksBrojVolontera=" + maksbrojvolontera + ", status=" + status + ", projectID=" + projektID
				+ ", hitan=" + hitan + ", organizationID=" + organizationID + "]";
	}
	public Integer getBrojPrijavljenihVolontera() {
		return brojprijavljenihvolontera;
	}
}
