<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'service_id',
        'message',
        'status',
        'priority',
        'assigned_to',
        'notes',
        'user_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the service for this inquiry
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the user who made this inquiry
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the admin assigned to this inquiry
     */
    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Scope for filtering by status
     */
    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by priority
     */
    public function scopePriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Get status color for frontend
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'new' => '#3b82f6',
            'in_progress' => '#f59e0b',
            'completed' => '#10b981',
            'cancelled' => '#ef4444',
            default => '#6b7280'
        };
    }
}