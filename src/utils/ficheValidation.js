export function validateFicheForm(formData) {
  const errors = {}

  if (!formData.structure.trim()) {
    errors.structure = 'La structure est obligatoire.'
  }

  if (!formData.responsable.trim()) {
    errors.responsable = 'Le responsable est obligatoire.'
  }

  if (!formData.year.trim()) {
    errors.year = "L'année est obligatoire."
  }

  if (!formData.status.trim()) {
    errors.status = 'Le statut est obligatoire.'
  }

  if (!formData.priority.trim()) {
    errors.priority = 'La priorité est obligatoire.'
  }

  if (!formData.trainingDomain.trim()) {
    errors.trainingDomain = 'Le domaine de formation est obligatoire.'
  }

  if (!formData.trainingTitle.trim()) {
    errors.trainingTitle = "L'intitulé de la formation est obligatoire."
  }

  if (!formData.objective.trim()) {
    errors.objective = "L'objectif est obligatoire."
  }

  if (!formData.justification.trim()) {
    errors.justification = 'La justification est obligatoire.'
  }

  if (!formData.participants.trim()) {
    errors.participants = 'Le nombre de participants est obligatoire.'
  } else if (Number(formData.participants) < 1) {
    errors.participants = 'Le nombre de participants doit être supérieur à 0.'
  }

  if (!formData.estimatedBudget.trim()) {
    errors.estimatedBudget = 'Le budget estimé est obligatoire.'
  } else if (Number(formData.estimatedBudget) < 0) {
    errors.estimatedBudget = 'Le budget ne peut pas être négatif.'
  }

  if (!formData.desiredDeadline.trim()) {
    errors.desiredDeadline = 'Le délai souhaité est obligatoire.'
  }

  if (!formData.targetPopulation.trim()) {
    errors.targetPopulation = 'La population concernée est obligatoire.'
  }

  return errors
}