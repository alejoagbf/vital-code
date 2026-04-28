package HealthTech.S.A.S.VitalCode.domain;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@DiscriminatorValue("PACIENTE")
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor

public class Paciente extends  Usuario {

    @Column(name = "num_documento", unique = true)
    private Long numDocumento ;

    @Column(name = "fecha_nacimiento")
    private LocalDateTime fechaNacimiento ;

    @Column(name = "grupo_sanguineo")
    private String grupoSanguineo ;

    @Column(name = "EPS")
    private String eps ;

    @Column(name = "genero")
    private String genero ;

}
