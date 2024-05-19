/**
 * Module represents centroid class.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

import { Blog } from './Blog.js'

/**
 * Class represents a Centroid.
 */
export class Centroid {
  /**
   * Centroid constructor.
   */
  constructor () {
    this.wordsCount = []
    this.assignments = []
  }

  /**
   * Returns a word count.
   *
   * @param {number} index - Array index to return.
   * @returns {number} - Word count.
   */
  getWordCount (index) {
    return this.wordsCount[index]
  }

  /**
   * Updates word count at a specific index.
   *
   * @param {number} index - Index to update.
   * @param {number} count - New word count.
   */
  setWordCount (index, count) {
    this.wordsCount[index] = count
  }

  /**
   * Adds a blog to assignments.
   *
   * @param {Blog} assignment - A blog
   */
  assign (assignment) {
    this.assignments.push(assignment)
  }

  /**
   * Removes all centroid assignments.
   */
  removeAllAssignments () {
    this.assignments = []
  }
}
