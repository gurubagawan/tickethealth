class Submission < ApplicationRecord
  validates :feeling, presence: true
  validates :stress, presence: true
  validates :hashed_email, presence: true
end
