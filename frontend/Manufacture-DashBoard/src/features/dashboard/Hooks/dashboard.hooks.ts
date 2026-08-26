import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import {
  getDashboardDataAPI,
  getBatchesAPI,
  createBatchAPI,
  mintBatchAPI,
  getBatchDetailsAPI,
  getBatchPreviewAPI,
  initiateRecallAPI,
  lookupPackGlobalAPI,
  getBatchExportCsvUrl,
  downloadBatchCsvAPI,
  updateOrderStatusAPI,
  resolveAlertAPI,
} from '../service/dashboard.api';
import {
  setDashboardData,
  setDashboardLoading,
  setDashboardError,
  addBatch,
  addRecall,
  updateOrderStatus,
  resolveAlert,
  setActiveRoute,
  setTheme,
  setSelectedBatch,
  setBatchToRecall,
  setDateRange,
  setSidebarCollapsed,
  toggleSidebar,
  setMobileSidebarOpen,
  setSearchModalOpen,
  setHelpModalOpen,
  setRecallModalOpen,
  NavRoute,
} from '../slice/dashboard.slice';
import { useToast } from '../../../context/ToastContext';
import { Batch } from '../../../types';
import { parseApiError } from '../../../utils/errorHandler';

export const useDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((reduxState: RootState) => reduxState.dashboard);
  const { showToast } = useToast();

  const loadDashboard = useCallback(async () => {
    try {
      dispatch(setDashboardLoading(true));
      const data = await getDashboardDataAPI();
      dispatch(setDashboardData(data));
      return data;
    } catch (err: any) {
      const parsed = parseApiError(err, 'Failed to fetch dashboard data');
      dispatch(setDashboardError(parsed.message));
      if (!parsed.isAuthError) {
        showToast({
          type: 'warning',
          title: 'Blockchain Sync Notice',
          message: parsed.message,
        });
      }
      return null;
    } finally {
      dispatch(setDashboardLoading(false));
    }
  }, [dispatch, showToast]);

  const loadBatches = useCallback(async (params?: { status?: string; search?: string }) => {
    try {
      dispatch(setDashboardLoading(true));
      const batches = await getBatchesAPI(params);
      dispatch(setDashboardData({ batches }));
      return batches;
    } catch (err: any) {
      dispatch(setDashboardError(err?.message || 'Failed to load batches'));
      throw err;
    } finally {
      dispatch(setDashboardLoading(false));
    }
  }, [dispatch]);

  const registerNewBatch = useCallback(
    async (batchData: Partial<Batch>) => {
      try {
        dispatch(setDashboardLoading(true));
        const createdBatch = await createBatchAPI(batchData);
        createdBatch.mintStatus = 'MINTED';
        createdBatch.packsMinted = createdBatch.totalQuantity;
        dispatch(addBatch(createdBatch));
        showToast({
          type: 'success',
          title: 'Batch Created & Minted Successfully',
          message: `${createdBatch.id} (${createdBatch.medicineName}) created and cryptographically signed.`,
        });
        return createdBatch;
      } catch (err: any) {
        const parsed = parseApiError(err, 'Error occurred during batch creation.');
        dispatch(setDashboardError(parsed.message));
        showToast({
          type: 'error',
          title: 'Batch Registration Failed',
          message: parsed.message,
        });
        throw new Error(parsed.message);
      } finally {
        dispatch(setDashboardLoading(false));
      }
    },
    [dispatch, showToast]
  );

  const mintBatch = useCallback(
    async (batchId: string) => {
      try {
        const res = await mintBatchAPI(batchId);
        showToast({
          type: 'info',
          title: 'Minting Job Queued',
          message: `ES256 signing scheduled on pharma-core for batch ${batchId}.`,
        });
        return res;
      } catch (err: any) {
        const parsed = parseApiError(err, 'Failed to trigger batch minting.');
        showToast({
          type: 'error',
          title: 'Minting Failed',
          message: parsed.message,
        });
        throw new Error(parsed.message);
      }
    },
    [showToast]
  );

  const fetchBatchDetails = useCallback(
    async (batchId: string) => {
      return await getBatchDetailsAPI(batchId);
    },
    []
  );

  const fetchBatchPreview = useCallback(
    async (batchId: string, page = 1, limit = 50, search = '') => {
      return await getBatchPreviewAPI(batchId, page, limit, search);
    },
    []
  );

  const triggerRecall = useCallback(
    async (batchId: string, reason: string, severity: 'CRITICAL' | 'MAJOR' | 'MODERATE' = 'CRITICAL') => {
      try {
        dispatch(setDashboardLoading(true));
        const recallRecord = await initiateRecallAPI({ batchId, reason, severity });
        dispatch(addRecall(recallRecord));
        showToast({
          type: 'error',
          title: 'Batch Recall Broadcasted',
          message: `Immutable :RECALL transition committed for batch ${batchId}.`,
          duration: 6000,
        });
        return recallRecord;
      } catch (err: any) {
        const parsed = parseApiError(err, 'Failed to initiate recall.');
        dispatch(setDashboardError(parsed.message));
        showToast({
          type: 'error',
          title: 'Recall Failed',
          message: parsed.message,
        });
        throw new Error(parsed.message);
      } finally {
        dispatch(setDashboardLoading(false));
      }
    },
    [dispatch, showToast]
  );

  const lookupIdentifier = useCallback(
    async (identifier: string) => {
      return await lookupPackGlobalAPI(identifier);
    },
    []
  );

  const updateOrderState = useCallback(
    async (orderId: string, status: any) => {
      try {
        await updateOrderStatusAPI(orderId, status);
        dispatch(updateOrderStatus({ orderId, status }));
        showToast({
          type: 'info',
          title: 'Order Status Updated',
          message: `Order ${orderId} transitioned to ${status}.`,
        });
      } catch (err: any) {
        dispatch(setDashboardError(err?.message || 'Failed to update order'));
      }
    },
    [dispatch, showToast]
  );

  const resolveSecurityAlert = useCallback(
    async (alertId: string) => {
      try {
        await resolveAlertAPI(alertId);
        dispatch(resolveAlert(alertId));
        showToast({
          type: 'success',
          title: 'Alert Incident Resolved',
          message: `Incident ${alertId} marked as resolved and filed with compliance archive.`,
        });
      } catch (err: any) {
        dispatch(setDashboardError(err?.message || 'Failed to resolve alert'));
      }
    },
    [dispatch, showToast]
  );

  const toggleThemeMode = useCallback(
    (targetTheme?: 'dark' | 'light') => {
      const nextTheme = targetTheme || (state.theme === 'dark' ? 'light' : 'dark');
      dispatch(setTheme(nextTheme));
      if (nextTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    },
    [dispatch, state.theme]
  );

  const navigateTo = useCallback(
    (route: NavRoute) => {
      dispatch(setActiveRoute(route));
      dispatch(setMobileSidebarOpen(false));
    },
    [dispatch]
  );

  return {
    ...state,
    loadDashboard,
    loadBatches,
    registerNewBatch,
    mintBatch,
    fetchBatchDetails,
    fetchBatchPreview,
    triggerRecall,
    lookupIdentifier,
    getExportCsvUrl: getBatchExportCsvUrl,
    downloadBatchCsv: useCallback(
      async (batchId: string, type: 'packs' | 'boxes' | 'cartons' = 'packs') => {
        try {
          showToast({
            type: 'info',
            title: 'Preparing Download',
            message: `Fetching ${type.toUpperCase()} manifest for batch ${batchId}...`,
          });
          await downloadBatchCsvAPI(batchId, type);
          showToast({
            type: 'success',
            title: 'Download Ready',
            message: `Batch ${batchId} ${type.toUpperCase()} CSV manifest downloaded.`,
          });
        } catch (err: any) {
          const parsed = parseApiError(err, 'Failed to download batch CSV manifest.');
          showToast({
            type: 'warning',
            title: 'Export Unavailable',
            message: parsed.message,
            duration: 6000,
          });
        }
      },
      [showToast]
    ),
    updateOrderState,
    resolveSecurityAlert,
    toggleThemeMode,
    navigateTo,
    setActiveNav: navigateTo,
    activeNav: state.activeRoute,
    selectBatch: (b: Batch | null) => dispatch(setSelectedBatch(b)),
    setSelectedBatch: (b: Batch | null) => dispatch(setSelectedBatch(b)),
    setBatchToRecall: (b: Batch | null) => dispatch(setBatchToRecall(b)),
    setDateRange: (r: any) => dispatch(setDateRange(r)),
    setIsSidebarCollapsed: (c: boolean) => dispatch(setSidebarCollapsed(c)),
    toggleSidebar: () => dispatch(toggleSidebar()),
    setIsMobileSidebarOpen: (o: boolean) => dispatch(setMobileSidebarOpen(o)),
    setIsSearchOpen: (o: boolean) => dispatch(setSearchModalOpen(o)),
    setIsHelpOpen: (o: boolean) => dispatch(setHelpModalOpen(o)),
    setIsRecallModalOpen: (o: boolean) => dispatch(setRecallModalOpen(o)),
    initiateRecall: triggerRecall,
    addBatch: (b: Batch) => dispatch(addBatch(b)),
    updateOrderStatus: (id: string, s: any) => updateOrderState(id, s),
    resolveAlert: resolveSecurityAlert,
  };
};

