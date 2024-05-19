/**
 * Module represents blog class.
 *
 * @author Oliwer Ellréus <oe222ez@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Class represents a blog.
 */
export class Blog {
  /**
   * Blog constructor.
   *
   * @param {string} blogName - Name of the blog.
   * @param {object} wordsCount - Word counts.
   */
  constructor (blogName, wordsCount) {
    this.blogName = blogName
    this.wordsCount = wordsCount
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
}
