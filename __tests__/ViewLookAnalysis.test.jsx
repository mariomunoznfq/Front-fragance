import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ViewLookAnalysis from '../src/pages/FlowAdults/ViewLookAnalysis';

const mockSetUserData = vi.fn();
const mockOnNext = vi.fn();
const mockOnBack = vi.fn();

const defaultUserData = {
  gender: 'MAN',
  look: 'CASUAL',
  attitude: 'seguridad',
  plan: 'TRABAJO',
};

const renderComponent = (userData = defaultUserData) => {
  return render(
    <ViewLookAnalysis
      onNext={mockOnNext}
      onBack={mockOnBack}
      userData={userData}
      setUserData={mockSetUserData}
    />
  );
};

const mockFetch = () => {
  global.fetch = vi.fn();
};

const seleccionarLook = (lookTitle) => {
  fireEvent.click(screen.getByText(lookTitle));
};

describe('ViewLookAnalysis - Flujo Completo con Carrusel y Errores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch();
    global.VITE_API_BASE_URL = 'http://test-api.com';
    global.VITE_API_KEY = 'test-api-key';
  });

  describe('Flujo Carrusel + Error 400', () => {
    it('muestra carrusel durante carga y luego error 400', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      renderComponent();
      seleccionarLook('CASUAL');
      fireEvent.click(screen.getByText('RECOMENDACIÓN'));

      expect(screen.getByText('PREPARANDO SELECCIÓN')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('¡UPS! ALGO HA SALIDO MAL')).toBeInTheDocument();
        expect(screen.getByText('Datos incompletos o solicitud mal formada.')).toBeInTheDocument();
      });
    });
  });

  describe('Flujo Carrusel + Error 401', () => {
    it('muestra carrusel durante carga y luego error 401', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      renderComponent();
      seleccionarLook('ELEGANTE');
      fireEvent.click(screen.getByText('RECOMENDACIÓN'));

      await waitFor(() => {
        expect(screen.getByText('¡UPS! ALGO HA SALIDO MAL')).toBeInTheDocument();
        expect(screen.getByText('Falta la API Key o es inválida.')).toBeInTheDocument();
      });
    });
  });

  describe('Flujo Carrusel + Error 429', () => {
    it('muestra carrusel durante carga y luego error 429 (límite peticiones)', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      renderComponent();
      seleccionarLook('DEPORTIVO');
      fireEvent.click(screen.getByText('RECOMENDACIÓN'));

      await waitFor(() => {
        expect(screen.getByText('¡UPS! ALGO HA SALIDO MAL')).toBeInTheDocument();
        expect(screen.getByText('Has superado el límite de peticiones. Espera un momento.')).toBeInTheDocument();
      });
    });
  });

  describe('Flujo Carrusel + Error 500', () => {
    it('muestra carrusel durante carga y luego error 500', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      renderComponent();
      seleccionarLook('URBAN');
      fireEvent.click(screen.getByText('RECOMENDACIÓN'));

      await waitFor(() => {
        expect(screen.getByText('¡UPS! ALGO HA SALIDO MAL')).toBeInTheDocument();
        expect(screen.getByText('Error interno del servidor. Inténtalo más tarde.')).toBeInTheDocument();
      });
    });
  });

  describe('Flujo Carrusel + Error de Red', () => {
    it('muestra carrusel durante carga y luego error de conexión', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network request failed'));

      renderComponent();
      seleccionarLook('HIPPIE');
      fireEvent.click(screen.getByText('RECOMENDACIÓN'));

      await waitFor(() => {
        expect(screen.getByText('¡UPS! ALGO HA SALIDO MAL')).toBeInTheDocument();
        expect(screen.getByText('Network request failed')).toBeInTheDocument();
      });
    });
  });

  describe('Flujo Carrusel + Respuesta Vacía', () => {
    it('muestra carrusel durante carga y luego error de respuesta vacía', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ error: true }),
      });

      renderComponent();
      seleccionarLook('CASUAL');
      fireEvent.click(screen.getByText('RECOMENDACIÓN'));

      await waitFor(() => {
        expect(screen.getByText('¡UPS! ALGO HA SALIDO MAL')).toBeInTheDocument();
        expect(screen.getByText('La IA no ha devuelto ninguna fragancia')).toBeInTheDocument();
      });
    });
  });

  describe('Flujo Exitoso (carrusel + éxito)', () => {
    it('muestra carrusel durante carga y luego navega al resultado', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ fragance: 'Test Perfume' }),
      });

      renderComponent();
      seleccionarLook('CASUAL');
      fireEvent.click(screen.getByText('RECOMENDACIÓN'));

      expect(screen.getByText('PREPARANDO SELECCIÓN')).toBeInTheDocument();

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalled();
      });
    });
  });

  describe('Botón Volver a Intentarlo desde Error', () => {
    it('tras error, el botón limpia el error y vuelve al formulario', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      renderComponent();
      seleccionarLook('CASUAL');
      fireEvent.click(screen.getByText('RECOMENDACIÓN'));

      await waitFor(() => {
        expect(screen.getByText('¡UPS! ALGO HA SALIDO MAL')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('VOLVER A INTENTAR'));

      await waitFor(() => {
        expect(screen.queryByText('¡UPS! ALGO HA SALIDO MAL')).not.toBeInTheDocument();
        expect(screen.getByText('¿Cuál es tu outfit?')).toBeInTheDocument();
      });
    });
  });
});
