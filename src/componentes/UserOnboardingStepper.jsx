import React, { useState } from "react";
import {
  Stepper, Step, StepLabel, Button, Box, TextField, Typography,
  Grid, Paper, MenuItem, CircularProgress
} from "@mui/material";
import { useAuth } from "@/routes/AuthProvider";
import {  useNavigate } from "react-router-dom";

const steps = [
  "Datos personales",
  "Datos laborales",
  "Preferencias de terrenos",
];

const stepIcons = {
  0: '👤',
  1: '💼',
  2: '🏡',
};



export const UserOnboardingStepper = ({ onFinish }) => {
  const { user, updateUser } = useAuth(); // <-- asegúrate de tener updateUser
  const navigate = useNavigate();
  console.log("Usuario en UserOnboardingStepper:", JSON.stringify(user, null, 2));
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: user.id,
    first_login: false,
    datos_personales: {
      edad: "",
      estado_civil: "",
      hijos: "",
      telefono: "",
      direccion: "",
    },
    datos_laborales: {
      ocupacion: "",
      empresa: "",
      ingresos_mensuales: "",
      tipo_empleo: "",
      direccion_laboral: "",
    },
    preferencias: {
      zona_preferida: "",
      motivo_compra: "",
      Servicio_basico_min: "",
    },
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleSkip = () => handleNext();
  

  const handleFinish = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al actualizar perfil");
      const data = await res.json();
      console.log("Perfil actualizado:", data);

      // Actualiza el usuario en el contexto
      updateUser({
        ...user,
        ...formData,
        //...data, // Si el backend retorna el usuario actualizado, usa esto
      });

      if (onFinish) onFinish(data);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const input = (label, section, field, type = "text", options = null) => {
    if (options) {
      return (
        <TextField
          select
          label={label}
          fullWidth
          margin="normal"
          value={formData[section][field]}
          onChange={(e) => handleChange(section, field, e.target.value)}
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    return (
      <TextField
        type={type}
        label={label}
        fullWidth
        margin="normal"
        value={formData[section][field]}
        onChange={(e) => handleChange(section, field, e.target.value)}
      />
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Edad", "datos_personales", "edad", "number")}
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Estado civil", "datos_personales", "estado_civil", "text",
                ["Soltero/a", "Casado/a", "Viudo/a"]
              )}
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Hijos", "datos_personales", "hijos", "number")}
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Teléfono", "datos_personales", "telefono")}
            </Grid>
            <Grid item size={12}>
              {input("Dirección", "datos_personales", "direccion")}
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Medio de transporte", "datos_personales", "medio_transporte", "text",
                ["Auto", "Moto", "Autobús", "Caminando"]
              )}
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Ocupación", "datos_laborales", "ocupacion")}
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Empresa", "datos_laborales", "empresa")}
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Ingresos mensuales", "datos_laborales", "ingresos_mensuales", "number")}
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Tipo de empleo", "datos_laborales", "tipo_empleo", "text",
                ["Presencial", "Virtual", "Mixto"]
              )}
            </Grid>
            <Grid item size={12}>
              {input("Dirección laboral", "datos_laborales", "direccion_laboral")}
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Zona preferida", "preferencias", "zona_preferida")}
            </Grid>
            <Grid item size={{ xs: 12, sm: 6 }}>
              {input("Servicio basico minimo", "preferencias", "Servicio_basico_min", "text",
                ["Agua", "Energía electrica", "Internet"]
              )}
            </Grid>
            <Grid item size={12}>
              {input("Motivo de compra", "preferencias", "motivo_compra", "text",
                ["Vivienda", "Inversión", "Otro"]
              )}
            </Grid>
          </Grid>
        );

      default:
        return <Typography>Todos los pasos completados.</Typography>;
    }
  };

  const stepDescriptions = [
    {
      title: "Datos personales",
      subtitle: "Contanos un poco sobre vos para ajustar las recomendaciones."
    },
    {
      title: "Datos laborales",
      subtitle: "Nos ayuda a ofrecerte terrenos acordes a tu capacidad financiera."
    },
    {
      title: "Preferencias de terrenos",
      subtitle: "Indicá qué tipo de terrenos estás buscando."
    }
  ];

  return (
    <Box
       sx={{
         minHeight: "100vh",
         background: "linear-gradient(to bottom right, #e3f2fd, #f9fbe7)",
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         p: 3
       }}
    >

       {activeStep === 0 && (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" color="text.primary" fontWeight="bold" gutterBottom>
          ¡Bienvenido a Terrago 🌎
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight={900}>
          Es tu primera vez ingresando a la aplicación. Podés completar algunos datos
          para personalizar las recomendaciones de terrenos o simplemente
          omitir este paso si preferís hacerlo más tarde.
        </Typography>
      </Box>
    )}

      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 4,
          width: "100%",
          maxWidth: 700,
          backgroundColor: "white"
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel icon={stepIcons[index]}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {stepDescriptions[activeStep].title}
          </Typography>
          <Typography sx={{ color: "gray", mb: 3 }}>
            {stepDescriptions[activeStep].subtitle}
          </Typography>

          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Atrás
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleFinish}
              disabled={loading}
              sx={{ borderRadius: 3, px: 3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Finalizar"}
            </Button>
          ) : (
            <Box>
              <Button onClick={handleSkip} sx={{ mr: 1 }}>
                Omitir
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ borderRadius: 3, px: 3 }}
              >
                Siguiente
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
