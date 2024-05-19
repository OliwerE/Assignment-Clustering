/**
 * Module represents cluster controller.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import fs from 'fs'
import csv from 'csv-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import createError from 'http-errors'

import { Blog } from './Blog.js'
import { Centroid } from './Centroid.js'

// Get path to application
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Class represents Lits controller.
 */
export class ClusterController {
  /**
   * Class constructor.
   */
  constructor () {
    this.csvData = []
    this.blogs = []
    this.numberOfWords = 706
    this.wordsCount = [] // Used to generate random centroid counts
  }

  /**
   * Reads CSV data.
   */
  readCsvData () {
    fs.createReadStream(path.resolve(__dirname, '../../data/blogdata.csv'))
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        const dataToReturn = {}
        for (const key in data) {
          if (key === 'Blog') { // Blog name
            dataToReturn[key] = data[key]
          } else { // Word count
            dataToReturn[key] = parseInt(data[key])
          }
        }
        return this.csvData.push(dataToReturn)
      })
      .on('end', () => {
        this.createBlogObjects()
      })
  }

  /**
   * Creates all blog objects.
   */
  createBlogObjects () {
    for (let i = 0; i < this.csvData.length; i++) {
      const blog = this.createBlogObject(this.csvData[i])
      this.blogs.push(blog)
    }
  }

  /**
   * Creates a blog object.
   *
   * @param {object} blogData - Data about a blog.
   * @returns {Blog} - Blog object.
   */
  createBlogObject (blogData) {
    const blogName = blogData.Blog

    // Convert word keys into a word count array
    const wordsCount = []
    for (const key in blogData) {
      if (key !== 'Blog') {
        wordsCount.push(blogData[key])
      }
    }
    this.addToWordCountsArray(wordsCount) // Used to generate random centroid counts
    return new Blog(blogName, wordsCount)
  }

  /**
   * Add word counts from a blog to wordsCount.
   *
   * @param {Array} wordsCount - Array of word counts.
   */
  addToWordCountsArray (wordsCount) {
    // If each word does not have an array in wordsCount
    if (this.wordsCount.length !== this.numberOfWords) {
      this.wordsCount = [] // Reset wordsCount
      for (let i = 0; i < this.numberOfWords; i++) {
        this.wordsCount.push([])
      }
    }

    // Add word count to each word array
    for (let i = 0; i < wordsCount.length; i++) {
      this.wordsCount[i].push(wordsCount[i])
    }
  }

  /**
   * Returns K-means clusters.
   *
   * @param {object} req - Request object.
   * @param {object} res - Response object.
   * @param {Function} next - Next function.
   */
  getKmeans (req, res, next) {
    try {
      const { clusters, iterations } = req.query

      const centroids = this.kMeans(parseInt(clusters), parseInt(iterations))
      const responseData = this.formatResponseData(centroids)

      res.json({ msg: 'Cluster assignments', data: responseData })
    } catch (err) {
      next(createError(500))
    }
  }

  /**
   * Calculates distance between two blogs.
   *
   * @param {Blog} blogA - A blog.
   * @param {Blog} blogB - A blog.
   * @returns {number} - Pearson distance.
   */
  pearsonDistance (blogA, blogB) {
    let sumA = 0
    let sumB = 0
    let sumASquared = 0
    let sumBSquared = 0
    let pearsonSum = 0

    // Sum all words in both blogs
    for (let i = 0; i < this.numberOfWords; i++) {
      const wordCountA = blogA.getWordCount(i)
      const wordCountB = blogB.getWordCount(i)
      sumA += wordCountA
      sumB += wordCountB
      sumASquared += wordCountA ** 2
      sumBSquared += wordCountB ** 2
      pearsonSum += wordCountA * wordCountB
    }

    // Calculate pearson distance
    const numerator = pearsonSum - (sumA * sumB / this.numberOfWords)
    const denominator = Math.sqrt((sumASquared - sumA ** 2 / this.numberOfWords) * (sumBSquared - sumB ** 2 / this.numberOfWords))
    const inverted = 1.0 - numerator / denominator

    return inverted // = Inverted pearson distance
  }

  /**
   * K-means algorithm.
   *
   * @param {number} numOfClusters - Number of clusters.
   * @param {number} selectedNumOfIterations - Number of iterations.
   * @returns {Array} - Array of centroids.
   */
  kMeans (numOfClusters, selectedNumOfIterations) {
    const centroids = this.createCentroids(numOfClusters)

    for (let i = 0; i < selectedNumOfIterations; i++) {
      for (let c = 0; c < centroids.length; c++) {
        centroids[c].removeAllAssignments()
      }

      this.assignBlogsToClosestCentroid(centroids)
      this.recalculateAllCentroidCenter(centroids)
    }
    return centroids
  }

  /**
   * Creates all centroids.
   *
   * @param {number} numOfClusters - Number of centroids.
   * @returns {Array} - Array of centroid objects.
   */
  createCentroids (numOfClusters) {
    const centroids = []
    for (let c = 0; c < numOfClusters; c++) {
      const centroid = new Centroid()
      // For each word add random word count in centroid
      for (let i = 0; i < this.numberOfWords; i++) {
        const min = Math.min(...this.wordsCount[i]) // Dåligt om mycket data !!!
        const max = Math.max(...this.wordsCount[i]) // Dåligt om mycket data !!!
        centroid.setWordCount(i, Math.floor(Math.random() * (max - min + 1) + min))
      }
      centroids.push(centroid)
    }
    return centroids
  }

  /**
   * Assign blog to centroid.
   *
   * @param {Array} centroids - Array of centroids.
   */
  assignBlogsToClosestCentroid (centroids) {
    for (let b = 0; b < this.blogs.length; b++) {
      let distance = Number.MAX_VALUE
      let bestMatchingCentroid

      // Find closest centroid
      for (let c = 0; c < centroids.length; c++) {
        const centroidDistance = this.pearsonDistance(centroids[c], this.blogs[b])

        if (centroidDistance < distance) {
          bestMatchingCentroid = centroids[c]
          distance = centroidDistance
        }
      }
      bestMatchingCentroid.assign(this.blogs[b])
    }
  }

  /**
   * Re-caluclates centroid center.
   *
   * @param {Array} centroids - Array of centroids.
   */
  recalculateAllCentroidCenter (centroids) {
    for (let c = 0; c < centroids.length; c++) {
      for (let w = 0; w < this.numberOfWords; w++) {
        let average = 0
        for (let b = 0; b < centroids[c].assignments.length; b++) {
          average += centroids[c].assignments[b].getWordCount(w)
        }
        average /= centroids[c].assignments.length

        centroids[c].setWordCount(w, average)
      }
    }
  }

  /**
   * Creates response data array.
   *
   * @param {Array} centroidArray - Array of centroids.
   * @returns {Array} - Response data.
   */
  formatResponseData (centroidArray) {
    const response = []
    for (let i = 0; i < centroidArray.length; i++) {
      const centroidBlogNames = []
      for (let b = 0; b < centroidArray[i].assignments.length; b++) {
        centroidBlogNames.push(centroidArray[i].assignments[b].blogName)
      }
      response.push(centroidBlogNames)
    }
    return response
  }
}
