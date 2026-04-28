package HealthTech.S.A.S.VitalCode.domain;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.boot.internal.Abstract;

import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_usuario", discriminatorType = DiscriminatorType.STRING)
@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "tipo_usuario")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Paciente.class, name = "PACIENTE"),
        @JsonSubTypes.Type(value = Administrador.class, name = "ADMINISTRADOR"),
        @JsonSubTypes.Type(value = PersonalSalud.class, name = "PERSONAL_SALUD")
})
public abstract class Usuario {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario ;

    @Column(name = "correo" , unique = true, nullable = false)
    private String correo ;

    @Column(name = "contraseña", nullable = false)
    private String contrasena ;

    @Column(name = "estado", nullable = false)
    private Boolean estado ;

    @Column(name = "nombre", nullable = false)
    private String nombre ;

    @Column(name = "apellido", nullable = false)
    private String apellido ;

    @Column(name = "telefono", nullable = false)
    private String telefono ;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "ultimo_acceso", nullable = false)
    private LocalDateTime ultimoAcceso ;




}
