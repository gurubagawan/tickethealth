require 'digest'

class Api::SubmissionsController < ApplicationController
  skip_before_action :verify_authenticity_token
  def create
    submission = Submission.new(submission_params)

    if submission.save
      render json: { message: "Form submitted successfully" }, status: :created
    else
      render json: { errors: submission.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def submission_params
    clean = params.require(:submission).permit(:feeling, :stress, :comments)
    clean[:hashed_email] = Digest::SHA256.hexdigest(params[:submission][:email].downcase.strip)
    clean
  end
end
