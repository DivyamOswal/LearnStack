import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import * as certificateService from './certifications.service';

export const generateCertificate = asyncHandler(async (req: Request, res: Response) => {
  const certificate = await certificateService.generateCertificate(req.user!.id, req.body.courseId);
  res.status(201).json(new ApiResponse(201, certificate, 'Certificate generated successfully.'));
});

export const getMyCertificates = asyncHandler(async (req: Request, res: Response) => {
  const certificates = await certificateService.getMyCertificates(req.user!.id);
  res.status(200).json(new ApiResponse(200, certificates, 'Your certificates fetched.'));
});

// Public LearnStack no auth required. This is what a QR scan or shared link hits.
export const verifyCertificate = asyncHandler(async (req: Request, res: Response) => {
  const certificate = await certificateService.verifyCertificateByCode(req.params.code);
  res.status(200).json(new ApiResponse(200, certificate, 'Certificate verified.'));
});

export const downloadCertificate = asyncHandler(async (req: Request, res: Response) => {
  const certificate = await certificateService.getCertificateForDownload(req.params.id, req.user!.id);
  res.status(200).json(new ApiResponse(200, { pdfUrl: certificate.pdfUrl }, 'Certificate ready for download.'));
});

export const getAllCertificatesForAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const certificates = await certificateService.getAllCertificatesForAdmin();
  res.status(200).json(new ApiResponse(200, certificates, 'All certificates fetched.'));
});