import { Router } from 'express';
import { ClientesController } from '../controllers/clientesController';
import { authMiddleware } from '../middleware/auth';
import { body, param, validationResult } from 'express-validator';

const router = Router();

// Middleware para validar errores
const validateRequest = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para crear cliente
const createClienteValidation = [
  body('nombre')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('telefono')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 caracteres')
];

// Validaciones para actualizar cliente
const updateClienteValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('El teléfono debe tener entre 8 y 20 caracteres')
];

// Validación de ID
const idValidation = [
  param('id')
    .isNumeric()
    .withMessage('El ID debe ser un número')
];

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Rutas CRUD
router.get('/', ClientesController.getAll);
router.get('/:id', idValidation, validateRequest, ClientesController.getById);
router.post('/', createClienteValidation, validateRequest, ClientesController.create);
router.put('/:id', idValidation, updateClienteValidation, validateRequest, ClientesController.update);
router.delete('/:id', idValidation, validateRequest, ClientesController.delete);

export default router;