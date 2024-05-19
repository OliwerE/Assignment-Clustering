/**
 * Module represents Express router.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import createError from 'http-errors'

import { ClusterController } from '../controllers/cluster-controller.js'

export const router = express.Router()

const controller = new ClusterController()
controller.readCsvData()

router.get('/k-means', (req, res, next) => controller.getKmeans(req, res, next))

router.use('*', (req, res, next) => next(createError(404)))
